# Senior Node.js 001 — Concurrent Job Processor

## Context

You must implement the engine used by a notification service to process jobs against an external provider. The provider may succeed, fail, or take too long to respond. The engine must control concurrency and return a stable result for each job without losing its `id` association.

The exercise is designed for **60 minutes**: 5 minutes for reading, 40 for implementation, 10 for debugging, and 5 for review. Do not use artificial intelligence while solving it.

## Objective

Complete `src/jobProcessor.js`. The exported `processJobs` function must process a list of jobs using an asynchronous worker supplied by the caller.

The detailed signature and contract are documented in `src/jobProcessor.js` and in the requirements below. The file contains an intentional stub; no reference implementation is provided.

## Functional requirements

- Accept a list of jobs and run no more than `concurrency` workers simultaneously.
- Invoke each job as `worker(job, { signal })`.
- Enforce `timeoutMs` per attempt and represent timeouts as failures without rejecting the entire operation.
- Retry only worker failures up to `retries` times. A timeout also counts as a retryable failure.
- Produce one result per job, in input order, with `{ id, status, value }` for successes or `{ id, status, error }` for failures.
- `status` must be either `"fulfilled"` or `"rejected"`.
- Do not start additional jobs when the input is invalid.
- Reject the operation for invalid arguments with an appropriate `TypeError` or `RangeError`.
- Do not mutate the job list or its objects.

Verifiable details, including boundaries and exact option semantics, are documented in the stub and public tests. Hidden tests check combinations of concurrency, retries, synchronous errors, and cancellation signals.

## Installation and execution

```bash
npm install
npm run test:public
```

When finished:

```bash
npm run test:all
```

The `test:hidden` command exists for the local interview simulation. On a real platform, the hidden suite would not be shown to the candidate; it is present locally here by design, and its hidden status is a convention rather than a security measure.

## Constraints

Do not add dependencies unless you can justify them. Do not change the tests. The solution must work with a modern Node.js version and standard runtime APIs.
