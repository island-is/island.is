# Payments service

This service handles the creation and fetching of payment flows

Payment flows are initialised by either processes (like an application from the application system) or people working for organizations.

Payment flows are fetched by the payments web app (apps/payments) and rendered to the end user.

## Gotchas

When integrating to create a payment flow, be sure to check the Organization model in Contentful and make sure "kennitala" is not empty. This model is used to fetch the name and logo of the organization in the payment flow.

## Bank transfer

Direct bank-to-bank payment method (Blikk is the current provider). For the full flow through
the service, the payer-facing screens, and what happens for each provider payment status, see
[Bank transfer payment method](./src/app/bankTransferPayment/README.md).

## Payment worker

### What it does

The worker finds paid card payment flows that do not yet have an FJS charge, creates the charge via the payment flow service, and records the outcome in the `payment_worker_event` table. It is intended to run on a schedule (e.g. every 5 minutes).

### When events are recorded

- **Success** — FJS created the charge: one success event is recorded.
- **Failure (recorded)** — FJS returned an error (e.g. `FailedToCreateCharge`, `AlreadyCreatedCharge`): one failure event is recorded.
- **Failure (not recorded)** — No response from FJS (network/transient error): no event is recorded, but the failure is still counted in the worker run summary. The worker will retry on the next run.

### Retry delay

A flow that has never failed is processed as soon as it is picked up. A flow with **at least one failure event** is **deferred** until the configured delay has passed since its **latest** failure event, so an FJS outage does not exhaust the failure limit within a few runs.

- **Config:** `workerRetryDelayMinutesAfterFailure` (default 60). Deferred flows are listed in one info line per run and counted as `deferred (retry delay)` in the run summary.
- **Not gated:** network/transient errors (`FJS_NETWORK_ERROR`) record no event, so they do not start the delay. Such a flow is retried on every run (every 5 minutes) until FJS responds. Only failures that FJS or X-Road answered with an error response (recorded events) are delayed.

### Failure limit

The worker **skips** a flow (and requires manual intervention) when that flow has **at least N failure events** (e.g. 5). The limit is checked before the retry delay, so a capped flow stays parked regardless of when it last failed.

- **Config:** `workerMaxFailureEventsPerFlow` (default 5). If the number of failure events for that flow+task reaches this limit, the worker stops retrying that flow. With the default hourly retry delay this takes about 5 hours of consecutive recorded failures.

### Worker configuration

| Env var                                                      | Default | Description                                                                                                            |
| ------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `PAYMENTS_WORKER_MAX_FAILURE_EVENTS_PER_FLOW`                | 5       | Stop retrying a flow after this many failure events (FJS error responses) for that flow+task.                          |
| `PAYMENTS_WORKER_MINUTES_TO_WAIT_BEFORE_CREATING_FJS_CHARGE` | 5       | Only consider paid flows whose fulfillment is at least this many minutes old (avoids races with payment confirmation). |
| `PAYMENTS_WORKER_RETRY_DELAY_MINUTES_AFTER_FAILURE`          | 60      | After a failure event, wait at least this many minutes before trying that flow again (never-failed flows run at once). |

### Manual intervention

When a flow is skipped (failure count ≥ limit):

1. Inspect `payment_worker_event` for that `payment_flow_id` and `task_type = 'create_fjs_charge'`: check the latest failure `error_code`, `message`, and `metadata`.
2. Fix the root cause (e.g. upstream, data, or reconcile with FJS if the charge already exists).
3. To allow the worker to retry: delete or archive the failure rows for that flow+task.

For **AlreadyCreatedCharge**: reconcile the flow/fulfillment with the existing FJS charge (e.g. update our DB with the reception ID and FJS charge id). Failure events are recorded with error code `AlreadyCreatedCharge`, so the flow will eventually be skipped by the failure limit.

### Monitoring

- The worker logs one info line per run when flows are skipped: `Skipping N payment flow(s) that exceeded the failure limit (5) and require manual intervention: <ids>`.
- The worker logs one info line per run when flows are deferred: `Deferring N payment flow(s) that failed less than 60 minute(s) ago: <ids>`.
- Each run ends with `Payment worker run complete — created: X, failed: Y, skipped (manual intervention): Z, deferred (retry delay): W`.
- Optional: add metrics for flows processed, succeeded, failed, skipped, and deferred.
