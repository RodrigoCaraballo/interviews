const { processJobs } = require('../../src/jobProcessor');

// Hidden in the interview simulation: these cases intentionally provide no
// additional contract beyond README/src/jobProcessor.js.
describe('processJobs - hidden robustness checks', () => {
  test('supports an empty input without invoking the worker', async () => {
    const worker = jest.fn();
    await expect(processJobs([], worker)).resolves.toEqual([]);
    expect(worker).not.toHaveBeenCalled();
  });

  test('does not exceed concurrency when earlier jobs reject synchronously', async () => {
    let active = 0;
    let maximum = 0;
    const result = await processJobs(
      Array.from({ length: 8 }, (_, i) => ({ id: String(i) })),
      async (job) => {
        active += 1;
        maximum = Math.max(maximum, active);
        if (job.id === '0' || job.id === '3') {
          active -= 1;
          throw new Error('fail');
        }
        await new Promise((resolve) => setTimeout(resolve, 2));
        active -= 1;
        return job.id;
      },
      { concurrency: 3 },
    );
    expect(maximum).toBeLessThanOrEqual(3);
    expect(result).toHaveLength(8);
    expect(result.filter((item) => item.status === 'rejected')).toHaveLength(2);
  });

  test('retries timeout attempts and eventually settles', async () => {
    let calls = 0;
    const result = await processJobs([{ id: 'x' }], () => {
      calls += 1;
      return calls === 1 ? new Promise(() => {}) : Promise.resolve('recovered');
    }, { timeoutMs: 5, retries: 1 });
    expect(calls).toBe(2);
    expect(result).toEqual([{ id: 'x', status: 'fulfilled', value: 'recovered' }]);
  });

  test('rejects malformed job ids and invalid option types', async () => {
    const worker = jest.fn();
    await expect(processJobs([{ id: '' }], worker)).rejects.toBeInstanceOf(TypeError);
    await expect(processJobs([{ id: 'x' }], worker, { concurrency: 1.5 }))
      .rejects.toBeInstanceOf(RangeError);
    await expect(processJobs([{ id: 'x' }], worker, { timeoutMs: -1 }))
      .rejects.toBeInstanceOf(RangeError);
    expect(worker).not.toHaveBeenCalled();
  });
});
