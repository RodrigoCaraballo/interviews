# Node.js reference

Short reference available during the exercise. It does not contain the solution or a specific algorithm.

## Promises and async/await

- An `async` function always returns a Promise.
- `Promise.all()` rejects when any input rejects.
- `Promise.allSettled()` waits for every input and returns `fulfilled` or `rejected` states.
- An error thrown inside an `async` function becomes a rejection.

## Timers

```js
setTimeout(callback, delay);
clearTimeout(handle);
```

Timers are tasks scheduled by the event loop; they do not block the JavaScript thread while waiting.

## AbortController

```js
const controller = new AbortController();
controller.signal.aborted;
controller.abort(reason);
```

A cooperative API can observe `signal.aborted` or listen for the `abort` event. AbortController cannot forcibly stop JavaScript code that does not cooperate.

## Errors

Use `Error` for operational failures and `TypeError`/`RangeError` for arguments with an invalid type or range. A rejection value can be any reason, but consumers should receive useful information.

## Commands

```bash
npm install
npm run test:public
npm run test:hidden
npm run test:all
```
