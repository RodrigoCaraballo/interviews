# Senior Node.js 002 — Idempotent Event API

## Scenario

You are implementing an endpoint used by payment providers to deliver event notifications. Providers may retry the same HTTP request when they do not receive a response, and network behavior can cause two identical requests to reach the service at nearly the same time.

The endpoint must publish each logical event at most once, return consistent responses for retries, and avoid permanently recording failed deliveries.

The exercise is designed for **60 minutes**: 5 minutes for reading, 40 for implementation, 10 for debugging, and 5 for review. Do not use artificial intelligence while solving it.

## Objective

Complete `src/app.js`. Implement and export `createApp({ publish })`, which returns an Express application exposing the required endpoint. `publish` is an asynchronous dependency supplied by the caller and must not be implemented by the candidate.

The starter file contains the exact contract and an intentional stub. No reference implementation is provided.

## Functional requirements

- Expose `POST /events`.
- Require a non-empty `Idempotency-Key` request header.
- Require a JSON body with non-empty string fields `eventId` and `type`, plus a `payload` object.
- Return `400` for malformed input and do not call `publish`.
- Call `publish(event)` exactly once for the first valid request for an idempotency key. The event must contain `eventId`, `type`, and `payload`.
- On a successful first delivery, return `201` with `{ eventId, status: "published" }` and remember the response.
- A later request with the same key and the same event must return `200` with the same JSON body without calling `publish` again.
- Reusing a key with a different event must return `409` with `{ error: "IDEMPOTENCY_KEY_REUSED" }`.
- Concurrent identical requests must result in one publish operation and equivalent successful response bodies.
- If `publish` rejects, return `502` with `{ error: "EVENT_PUBLISH_FAILED" }`, do not cache the failed request, and allow a later retry to call `publish` again.
- Return JSON responses and use centralized error handling; do not leak raw dependency error messages.

The implementation must not depend on external services or a database. In-memory state is sufficient for this exercise. The tests may send requests concurrently and may delay or reject `publish`.

## Installation and execution

```bash
npm install
npm run test:public
```

When finished, run all tests:

```bash
npm run test:all
```

The `test:hidden` command exists for the local interview simulation. Hidden tests are present in this repository by design; hiding them is a convention, not a security boundary.

## Constraints

Do not change the tests. Do not add dependencies unless you can justify them. Keep the implementation focused on the endpoint contract; authentication, persistence, and production deployment are out of scope.
