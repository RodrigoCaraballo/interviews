# Node.js and Express reference

Short reference available during the exercise. It contains no solution or exercise-specific algorithm.

## Express application

```js
const express = require('express');
const app = express();

app.use(express.json());
app.post('/events', handler);
app.use((error, request, response, next) => {
  response.status(500).json({ error: 'INTERNAL_ERROR' });
});
```

Middleware and route handlers receive `(request, response, next)`. A response should be sent once. Error middleware has four parameters and should be registered after routes.

## Request data

```js
request.get('Header-Name');
request.body;
response.status(201).json({ key: 'value' });
```

Header names are case-insensitive. JSON parsing middleware must run before routes that read `request.body`.

## Promises and concurrent calls

- An `async` function returns a Promise.
- `Promise.all()` rejects if any input rejects.
- `Promise.resolve()` normalizes a synchronous value or Promise.
- Multiple callers can enter asynchronous code before an earlier Promise settles; shared state must account for this.

## Errors

Use `400` for invalid client input, `409` for a request conflicting with existing state, `502` when a dependency fails, and `500` for unexpected server errors. Do not expose raw internal error messages in API responses.

## Commands

```bash
npm install
npm run test:public
npm run test:hidden
npm run test:all
```
