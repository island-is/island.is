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

## Debt payments (Greiðsla skulda)

Lets an application (e.g. the Fjármál overview) have a person or company pay debts owed to Fjársýsla ríkisins (FJS). Debt flows use the same `payment_flow` table and pay page as charge flows, with `type = 'debt'`. FJS `validatePayment` decides whether the debts can be paid, and after capture the payment is registered with FJS (`payDebt`).

### Creating a flow

`POST /v1/payments/debts`

| Field                                                    | Rules                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| `payerNationalId`                                        | Individual or company.                                       |
| `onUpdateUrl`                                            | Webhook receiving the events below.                          |
| `metadata`                                               | Optional JSON, echoed back in every webhook.                 |
| `returnUrl`, `cancelUrl`, `redirectToReturnUrlOnSuccess` | Optional, as for charge flows.                               |
| `debts[]`                                                | 1 to 50 items, see below.                                    |
| `debts[].payId`                                          | FJS payId. Required, non-empty, unique within the request.   |
| `debts[].amount`                                         | Positive integer, whole ISK. May be less than the full debt. |
| `debts[].label`                                          | Optional, up to 255 characters, display only.                |

`organisationId` (FJS, `5402697509`) is set by the service and `productTitle` is not used, so neither is sent. `GET /v1/payments/:id` returns `type: 'debt'` and the fallback title "Greiðsla skulda"; the pay page shows its own translated title. The debts are validated with FJS when the flow is created.

Payment methods come from the `paymentOptions` FJS returns from `validatePayment` (e.g. `CARD;TRANSFER`), limited by our feature flags and payer rules. `CARD` enables card and Apple Pay, `TRANSFER` enables bank transfer. Invoice payment is never offered.

Response: `{ id, urls: { is, en } }`. Send the payer to `urls`. `id` is also the `payFlowId` used towards FJS.

Errors (`detail` of the problem response, or the error code on the pay page):

| Code                                    | Meaning                                                                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `DebtPaymentInvalid`                    | FJS says the debts can not be paid (changed, already paid).                                                                |
| `DebtPaymentMethodNotAllowed`           | FJS does not allow the chosen payment method for these debts.                                                              |
| `DebtPaymentRejected`                   | FJS rejected the payment after the card was charged. The card is refunded.                                                 |
| `DebtPaymentFlowClosed`                 | The flow was rejected by FJS earlier and can not be used again.                                                            |
| `DebtPaymentRegisteredCannotBeRefunded` | Returned by `POST /v1/payments/refund` for a flow registered with FJS (or in `needs_reconciliation`), FJS has no reversal. |

The debts are validated with FJS again right before every capture, so a flow can fail with `DebtPaymentInvalid` long after it was created. Flows do not expire.

### Webhook sequences

Events are POSTed to `onUpdateUrl` (signed JWT in the `Authorization` header) as `{ type, paymentFlowId, paymentFlowMetadata, occurredAt, details: { paymentMethod, reason, message, eventMetadata } }`. `paymentFlowMetadata` is the `metadata` from the request, and the event specific fields below are in `details.eventMetadata`.

- **Happy path**: `success/payment_completed` when the money is captured, then `update/payment_finalized` when FJS accepts the registration (202), with `eventMetadata.dateCreated`. If registration could not finish inline, the payment worker retries and `payment_finalized` comes later. FJS answers a payFlowId it already has with 400 and error `type` `6`, so when a retry gets that after a call whose response was lost, the payment counts as registered and `payment_finalized` comes without `dateCreated`.
- **Card or Apple Pay, rejected inline**: FJS rejects (400) before the registration is accepted. The card is refunded and the application gets `error/payment_failed` (`eventMetadata.fjsProblem`). There is no `payment_completed`. If that refund fails, the payer gets `RefundFailedAfterPaymentError` and a CRITICAL alert asks for a manual refund, as for charge flows: the rollback removes the fulfillment before refunding, so the worker does not retry it.
- **Rejected later by the worker**: `payment_completed` was already sent, then `error/payment_failed`. A card payment is then refunded automatically and the usual refund events follow. A bank transfer is not refunded automatically (Blikk refunds need an SCA approval): the `payment_failed` event has `eventMetadata.needsManualRefund = true` and the money is returned manually.
- **Bank transfer rejected inline** behaves like the late rejection above: `payment_completed` is sent when the transfer settles, then `error/payment_failed` with `needsManualRefund`.
- **`needs_reconciliation`**: FJS rejected the payment after an attempt whose outcome was unknown, so it may already be registered, or reported the payFlowId as a duplicate when no earlier attempt explains it. This is internal: no webhook is sent, the payment stays completed, and an error event and alert ask for manual reconciliation. It is never refunded automatically.

`eventMetadata.fjsProblem.type` is FJS's error code: `2` kennitala not found, `3` payId not found, `4` payId does not belong to the kennitala, `5` total does not match the debts, `10` bad payment date, `14` payInfo missing, `15` payInfo amount does not match the total. Code `6` (payFlowId already received) is handled as above, and code `12` (another payment for the debts is in progress) is not a rejection: the payment is left pending and the worker retries it.

FJS registers the payment asynchronously (202 Accepted), so the payer's Fjármál status can lag behind `payment_finalized`. Treat 202 as final: failures after it are for FJS to resolve.

### Rejected and closed flows

A rejected flow is terminal and its id is never reused for a second registration. The pay page shows "Skuldastaðan hefur breyst" and `GetPaymentFlowDTO.isClosed` is `true`. The application should start a new flow with `POST /v1/payments/debts`. A paid flow still shows its receipt.

## Payment worker

### What it does

The worker finds paid card payment flows that do not yet have an FJS charge, creates the charge via the payment flow service, and records the outcome in the `payment_worker_event` table. It is intended to run on a schedule (e.g. every 5 minutes).

### When events are recorded

- **Success** — FJS created the charge: one success event is recorded.
- **Failure (recorded)** — Any other error while processing the flow, whether FJS returned an error (e.g. `FailedToCreateCharge`, `AlreadyCreatedCharge`) or a local error was raised before the FJS request: one failure event is recorded.
- **Failure (not recorded)** — No response from FJS (network/transient error): no event is recorded, but the failure is still counted in the worker run summary. The worker will retry on the next run.

### Retry delay

A flow that has never failed is processed as soon as it is picked up. A flow with **at least one failure event** is **deferred** until the configured delay has passed since its **latest** failure event, so an FJS outage does not exhaust the failure limit within a few runs.

- **Config:** `workerRetryDelayMinutesAfterFailure` (default 60). Deferred flows are listed in one info line per run and counted as `deferred (retry delay)` in the run summary.
- **What starts the delay:** every failure the worker records, i.e. any error thrown while processing the flow except `FJS_NETWORK_ERROR`. This includes FJS error responses, X-Road errors, and local errors raised before the FJS request (e.g. missing card payment details, missing bank transfer row, catalog mismatch).
- **Not gated:** network/transient errors (`FJS_NETWORK_ERROR`) record no event, so they do not start the delay. Such a flow is retried on every run (every 5 minutes) until FJS responds.
- **Debt flows:** the debt pass (`pay_fjs_debt`) uses the same delay and failure limit, counted on its own failure events. A `payDebt` call FJS refused (401/403) or an error while settling records a failure; an ambiguous outcome or FJS being unreachable records none and is retried on the next run.

### Failure limit

The worker **skips** a flow (and requires manual intervention) when that flow has **at least N failure events** (e.g. 5). The limit is checked before the retry delay, so a capped flow stays parked regardless of when it last failed.

- **Config:** `workerMaxFailureEventsPerFlow` (default 5). If the number of failure events for that flow+task reaches this limit, the worker stops retrying that flow. With the default hourly retry delay this takes about 5 hours of consecutive recorded failures.

### Worker configuration

| Env var                                                      | Default | Description                                                                                                            |
| ------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `PAYMENTS_WORKER_MAX_FAILURE_EVENTS_PER_FLOW`                | 5       | Stop retrying a flow after this many failure events (FJS error responses) for that flow+task.                          |
| `PAYMENTS_WORKER_MINUTES_TO_WAIT_BEFORE_CREATING_FJS_CHARGE` | 5       | Only consider paid flows whose fulfillment is at least this many minutes old (avoids races with payment confirmation). |
| `PAYMENTS_WORKER_RETRY_DELAY_MINUTES_AFTER_FAILURE`          | 60      | After a failure event, wait at least this many minutes before trying that flow again (never-failed flows run at once). |
| `PAYMENTS_WORKER_MINUTES_TO_WAIT_BEFORE_SETTLING_DEBT`       | 1       | Only consider paid debt flows whose fulfillment and last `payDebt` attempt are at least this many minutes old.         |

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
- The debt pass logs the same skip and defer lines for debt payment flows, and ends with `Debt payment run complete — settled: X, failed: Y, skipped (manual intervention): Z, deferred (retry delay): W`.
- Optional: add metrics for flows processed, succeeded, failed, skipped, and deferred.
