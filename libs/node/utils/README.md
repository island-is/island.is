# Node Utils

## `setupShutdownHooks`

The `setupShutdownHooks` function configures a server to properly handle shutdown signals, ensuring a graceful termination process. This is particularly useful for preventing the server from hanging when the parent process disconnects, such as after end-to-end tests complete.

### Parameters

- `server` (Server): An instance of an HTTP server that needs to be shut down gracefully upon receiving termination signals.
- `onShutdown` (Function): Optional callback function that will be executed before the server shuts down. Can be used to perform and wait for other cleanup tasks before the server shuts down.

### Behavior

- Listens for system signals indicating process termination: `SIGHUP`, `SIGINT`, and `SIGTERM`.
- When executed by an NX runner (detected by `process.env.NX_INVOKED_BY_RUNNER === 'true'`), it also listens for the `disconnect` event.
- On receiving a termination signal:
- Logs the signal received.
- Closes the server using `server.close()`, awaiting closure before continuing.
- Executes the `onShutdown` callback if provided.
- Logs the successful server shutdown and exits the process with a status code of `0` upon successful shutdown or `1` if an error occurs.

## Running unit tests

Run `nx test node-utils` to execute the unit tests via [Jest](https://jestjs.io).
