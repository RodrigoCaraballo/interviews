const request = require('supertest');
const { createApp } = require('../../src/app');

const event = {
  eventId: 'evt-1',
  type: 'invoice.paid',
  payload: { invoiceId: 'inv-1', amount: 1250 },
};

describe('POST /events - public contract', () => {
  test('publishes a valid event and returns 201', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const app = createApp({ publish });

    const response = await request(app)
      .post('/events')
      .set('Idempotency-Key', 'key-1')
      .send(event);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ eventId: 'evt-1', status: 'published' });
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith(event);
  });

  test('rejects missing idempotency key and does not publish', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const app = createApp({ publish });

    const response = await request(app).post('/events').send(event);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'INVALID_REQUEST' });
    expect(publish).not.toHaveBeenCalled();
  });

  test('rejects malformed event data', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const app = createApp({ publish });

    const response = await request(app)
      .post('/events')
      .set('Idempotency-Key', 'key-1')
      .send({ eventId: '', type: 'invoice.paid', payload: null });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'INVALID_REQUEST' });
    expect(publish).not.toHaveBeenCalled();
  });

  test('replays a successful request without publishing again', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const app = createApp({ publish });

    const first = await request(app).post('/events').set('Idempotency-Key', 'key-1').send(event);
    const second = await request(app).post('/events').set('Idempotency-Key', 'key-1').send(event);

    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect(second.body).toEqual(first.body);
    expect(publish).toHaveBeenCalledTimes(1);
  });

  test('rejects reuse of a key with a different event', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const app = createApp({ publish });

    await request(app).post('/events').set('Idempotency-Key', 'key-1').send(event);
    const response = await request(app)
      .post('/events')
      .set('Idempotency-Key', 'key-1')
      .send({ ...event, eventId: 'evt-2' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'IDEMPOTENCY_KEY_REUSED' });
    expect(publish).toHaveBeenCalledTimes(1);
  });

  test('maps publisher failures to 502 and allows a later retry', async () => {
    const publish = jest.fn()
      .mockRejectedValueOnce(new Error('provider secret details'))
      .mockResolvedValueOnce(undefined);
    const app = createApp({ publish });

    const failed = await request(app).post('/events').set('Idempotency-Key', 'key-1').send(event);
    const retried = await request(app).post('/events').set('Idempotency-Key', 'key-1').send(event);

    expect(failed.status).toBe(502);
    expect(failed.body).toEqual({ error: 'EVENT_PUBLISH_FAILED' });
    expect(JSON.stringify(failed.body)).not.toContain('provider secret details');
    expect(retried.status).toBe(201);
    expect(publish).toHaveBeenCalledTimes(2);
  });
});
