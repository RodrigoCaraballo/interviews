const { processJobs } = require('../../src/jobProcessor');

describe('processJobs - public contract', () => {
  test('returns fulfilled results in input order', async () => {
    const jobs = [{ id: 'a', n: 2 }, { id: 'b', n: 3 }];
    const result = await processJobs(jobs, async (job) => job.n * 2);

    expect(result).toEqual([
      { id: 'a', status: 'fulfilled', value: 4 },
      { id: 'b', status: 'fulfilled', value: 6 },
    ]);
  });

  test('limits active workers to concurrency', async () => {
    let active = 0;
    let maximum = 0;
    const worker = async (job) => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, job.delay));
      active -= 1;
      return job.id;
    };

    await processJobs(
      [{ id: '1', delay: 15 }, { id: '2', delay: 10 }, { id: '3', delay: 5 }],
      worker,
      { concurrency: 2 },
    );

    expect(maximum).toBe(2);
  });

  test('isolates worker failures and keeps all result positions', async () => {
    const result = await processJobs(
      [{ id: 'ok' }, { id: 'bad' }],
      async (job) => {
        if (job.id === 'bad') throw new Error('provider unavailable');
        return 'done';
      },
    );

    expect(result[0]).toEqual({ id: 'ok', status: 'fulfilled', value: 'done' });
    expect(result[1].id).toBe('bad');
    expect(result[1].status).toBe('rejected');
    expect(result[1].error).toEqual(expect.any(Error));
  });

  test('retries a failed job up to the configured number of additional attempts', async () => {
    let calls = 0;
    const result = await processJobs([{ id: 'retry' }], async () => {
      calls += 1;
      if (calls < 3) throw new Error('temporary');
      return 'ok';
    }, { retries: 2 });

    expect(calls).toBe(3);
    expect(result).toEqual([{ id: 'retry', status: 'fulfilled', value: 'ok' }]);
  });

  test('turns a worker that exceeds timeoutMs into a rejected result', async () => {
    const result = await processJobs([{ id: 'slow' }], () => new Promise(() => {}), {
      timeoutMs: 10,
    });

    expect(result[0].status).toBe('rejected');
    expect(result[0].error).toEqual(expect.any(Error));
  });

  test('rejects invalid arguments before invoking the worker', async () => {
    const worker = jest.fn();

    await expect(processJobs('not-an-array', worker)).rejects.toBeInstanceOf(TypeError);
    await expect(processJobs([{ id: 'x' }], worker, { concurrency: 0 }))
      .rejects.toBeInstanceOf(RangeError);
    await expect(processJobs([{ id: 'x' }], worker, { retries: -1 }))
      .rejects.toBeInstanceOf(RangeError);
    expect(worker).not.toHaveBeenCalled();
  });

  test('does not mutate input jobs', async () => {
    const jobs = [{ id: 'x', payload: { count: 1 } }];
    const snapshot = JSON.parse(JSON.stringify(jobs));
    await processJobs(jobs, async () => 'ok');
    expect(jobs).toEqual(snapshot);
  });
});
