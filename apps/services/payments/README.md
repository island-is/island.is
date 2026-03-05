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
- **Failure** — FJS returned an error (e.g. `FailedToCreateCharge`): one failure event is recorded.
- **No event** — No response from FJS (network/transient error, timeout, connection refused, etc.): no event is recorded; the worker will retry on the next run.
- **No event** — FJS returned `AlreadyCreatedCharge` (charge already exists in FJS but our DB was not updated): no event is recorded; manual reconciliation is required (see below).

### Failure limit

The worker **skips** a flow (and requires manual intervention) when that flow has **at least N failure events** (e.g. 5). Only events from actual FJS error responses count toward this limit; network errors and `AlreadyCreatedCharge` do not.

- **Config:** `workerMaxFailureEventsPerFlow` (default 5). If the number of failure events for that flow+task reaches this limit, the worker stops retrying that flow.

### AlreadyCreatedCharge

When FJS reports that the charge already exists (e.g. from a previous run) but our DB was never updated, the worker does **not** record an event. It logs a warning and keeps retrying the flow until someone reconciles (e.g. by updating the flow/fulfillment with the existing FJS charge). Thanks to the decoupling of payment confirmation and FJS charge creation, this situation should be rare.

### Task types

- `create_fjs_charge` — Create FJS charge for paid card flows. The `payment_worker_event` table is generic; add new task type values when adding new worker tasks.

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

For **AlreadyCreatedCharge**: reconcile the flow/fulfillment with the existing FJS charge (e.g. update our DB with the reception ID and FJS charge id). No event is recorded, so the flow is not counted toward the failure limit.

### Monitoring

- The worker logs a warning when flows are skipped: `Skipped N flow(s) with 5+ failure events (manual intervention required)`.
- Optional: add metrics for flows processed, succeeded, failed, and skipped.
