/**
 * Processes jobs with bounded concurrency, per-attempt timeouts and retries.
 *
 * Contract for the candidate:
 *   processJobs(jobs, worker, options) -> Promise<Result[]>
 *
 * jobs: non-null Array. Every item must be an object with a non-empty string id.
 * worker: (job, context) => any | Promise<any>. context.signal is an AbortSignal.
 * options:
 *   concurrency: positive integer, default 1
 *   timeoutMs: non-negative finite number, default 5000
 *   retries: non-negative integer, default 0 (additional attempts)
 *
 * Results preserve input order:
 *   { id, status: 'fulfilled', value }
 *   { id, status: 'rejected', error }
 *
 * Invalid arguments must reject before invoking the worker. A worker failure
 * must be isolated to its job; the overall operation should still settle
 * results for all valid jobs.
 */
async function processJobs(jobs, worker, options = {}) {
  throw new Error('Not implemented: complete processJobs');
}

module.exports = { processJobs };
