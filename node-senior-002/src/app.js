/**
 * Creates the event delivery API.
 *
 * Contract for the candidate:
 *   createApp({ publish }) -> Express application
 *
 * publish: (event) => any | Promise<any>
 * event: { eventId: string, type: string, payload: object }
 *
 * The application must expose POST /events. See README.md for the HTTP
 * contract. Idempotency is scoped to the lifetime of the returned app.
 *
 * Requirements include validation, duplicate replay, conflicting reuse,
 * concurrent identical requests, and safe handling of publish failures.
 */
function createApp({ publish }) {
  throw new Error('Not implemented: complete createApp');
}

module.exports = { createApp };
