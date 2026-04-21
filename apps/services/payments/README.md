# Payments service

This service handles the creation and fetching of payment flows

Payment flows are initialised by either processes (like an application from the application system) or people working for organizations.

Payment flows are fetched by the payments web app (apps/payments) and rendered to the end user.

## Gotchas

When integrating to create a payment flow, be sure to check the Organization model in Contentful and make sure "kennitala" is not empty. This model is used to fetch the name and logo of the organization in the payment flow.

## Payment worker

### What it does

The worker finds paid card payment flows that do not yet have an FJS charge, creates the charge via the payment flow service, and records the outcome in the `payment_worker_event` table. It is intended to run on a schedule (e.g. every 5 minutes).

### When events are recorded

- **Success** — FJS created the charge: one success event is recorded.
- **Failure (recorded)** — FJS returned an error (e.g. `FailedToCreateCharge`, `AlreadyCreatedCharge`): one failure event is recorded.
- **Failure (not recorded)** — No response from FJS (network/transient error): no event is recorded, but the failure is still counted in the worker run summary. The worker will retry on the next run.

### Failure limit

The worker **skips** a flow (and requires manual intervention) when that flow has **at least N failure events** (e.g. 5).

- **Config:** `workerMaxFailureEventsPerFlow` (default 5). If the number of failure events for that flow+task reaches this limit, the worker stops retrying that flow.

### Worker configuration

| Env var | Default | Description |
|--------|---------|-------------|
| `PAYMENTS_WORKER_MAX_FAILURE_EVENTS_PER_FLOW` | 5 | Stop retrying a flow after this many failure events (FJS error responses) for that flow+task. |
| `PAYMENTS_WORKER_MINUTES_TO_WAIT_BEFORE_CREATING_FJS_CHARGE` | 5 | Only consider paid flows whose fulfillment is at least this many minutes old (avoids races with payment confirmation). |

### Manual intervention

When a flow is skipped (failure count ≥ limit):

1. Inspect `payment_worker_event` for that `payment_flow_id` and `task_type = 'create_fjs_charge'`: check the latest failure `error_code`, `message`, and `metadata`.
2. Fix the root cause (e.g. upstream, data, or reconcile with FJS if the charge already exists).
3. To allow the worker to retry: delete or archive the failure rows for that flow+task.

For **AlreadyCreatedCharge**: reconcile the flow/fulfillment with the existing FJS charge (e.g. update our DB with the reception ID and FJS charge id). Failure events are recorded with error code `AlreadyCreatedCharge`, so the flow will eventually be skipped by the failure limit.

### Monitoring

- The worker logs a warning when flows are skipped: `Skipped N flow(s) with 5+ failure events (manual intervention required)`.
- Optional: add metrics for flows processed, succeeded, failed, and skipped.
