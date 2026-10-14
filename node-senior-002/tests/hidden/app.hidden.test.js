const request = require('supertest');
const { createApp } = require('../../src/app');

const event = { eventId: 'evt-1', type: 'invoice.paid', payload: { invoiceId: 'inv-1' } };

describe('POST /events - hidden robustness checks', () => {
  test('publishes only once for concurrent identical requests', async () => {
    let release;
    const publish = jest.fn(() => new Promise((resolve) => { release = resolve; }));
    const app = createApp({ publish });

    const first = request(app).post('/events').set('Idempotency-Key', 'same-key').send(event);
    const second = request(app).post('/events').set('Idempotency-Key', 'same-key').send(event);
    await new Promise((resolve) => setImmediate(resolve));
    release();

    const responses = await Promise.all([first, second]);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(responses.map((response) => response.status)).toEqual([201, 201]);
    expect(responses[0].body).toEqual(responses[1].body);
  });

  test('treats payload changes as key reuse conflicts', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const app = createApp({ publish });
    await request(app).post('/events').set('Idempotency-Key', 'same-key').send(event);

    const response = await request(app)
      .post('/events')
      .set('Idempotency-Key', 'same-key')
      .send({ ...event, payload: { invoiceId: 'different' } });

    expect(response.status).toBe(409);
    expect(publish).toHaveBeenCalledTimes(1);
  });

  test('returns JSON for malformed JSON bodies', async () => {
    const publish = jest.fn();
    const app = createApp({ publish });
    const response = await request(app)
      .post('/events')
      .set('Idempotency-Key', 'key-1')
      .set('Content-Type', 'application/json')
      .send('{"eventId":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'INVALID_REQUEST' });
    expect(publish).not.toHaveBeenCalled();
  });
});
