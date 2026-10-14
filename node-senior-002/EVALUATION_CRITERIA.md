# Evaluation criteria

## Scoring (100 points)

- **Functional correctness — 40 points**
  - 15: valid event publishing and response contract.
  - 15: idempotent replay and key-conflict behavior.
  - 10: failed publication is not permanently cached.
- **Edge cases and errors — 20 points**
  - 10: complete header/body validation.
  - 5: malformed JSON handling.
  - 5: safe status codes and sanitized error responses.
- **Node.js and asynchronous behavior — 20 points**
  - 10: concurrent identical requests trigger one publication.
  - 5: correct Promise/error handling for an asynchronous dependency.
  - 5: no race-prone check-then-act behavior.
- **Code quality and clarity — 10 points**
  - 5: clear middleware and state responsibilities.
  - 5: no unnecessary dependencies or mutation of request data.
- **Testing and robustness — 10 points**
  - 5: useful additional tests.
  - 5: deterministic behavior under concurrent requests and failures.

## Post-exercise report

Run `npm run test:all` after the exercise and record:

- passing and failing tests;
- score out of 100 and completed requirements;
- errors found and implementation issues;
- possible improvements and technical concepts to study.

Hidden tests are present locally for this simulation and run with `npm run test:hidden`. Their hidden status is a convention, not real protection against inspection.
