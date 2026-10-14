# Evaluation criteria

## Scoring (100 points)

- **Functional correctness — 40 points**
  - 15: results and input ordering.
  - 15: actual concurrency limit.
  - 10: retries and per-attempt timeout.
- **Edge cases and errors — 20 points**
  - 10: complete validation without invoking workers for invalid input.
  - 10: failure isolation, synchronous errors, and empty input.
- **Node.js and asynchronous programming — 20 points**
  - 10: does not block the event loop or create unbounded work.
  - 5: correct Promise usage and error propagation.
  - 5: cooperative timeout/cancellation without allowing a pending operation to block the result.
- **Code quality and clarity — 10 points**
  - 5: readable structure and clear responsibilities.
  - 5: does not mutate inputs and avoids unnecessary dependencies or complexity.
- **Testing and robustness — 10 points**
  - 5: adds or improves relevant tests.
  - 5: stable behavior under races and non-deterministic timing.

## Reporte posterior

After the exercise, run `npm run test:all` and record:

- passing and failing tests;
- score out of 100 and completed requirements;
- errors found and implementation issues;
- possible improvements and technical concepts to study.

The hidden tests are in the repository for this simulation and run separately with `npm run test:hidden`. They should not be considered real protection against inspection.
