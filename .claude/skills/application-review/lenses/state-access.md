# Lens: state machine, access, trust boundary, lifecycle

Severity is high when a user is stuck, unauthorised access is possible, an
unfinished application goes live, or client data steers the server. It is
medium otherwise.

For any template-file change, build the **state × role matrix** before you
apply S1. For each state, list:

- the roles;
- each role's `read`, `write` and `delete`;
- the role's `api` list and `formLoader`;
- the actions;
- the `on` events.

Then read `mapUserToRole` and note which conditions decide each role. If it
ignores `application.state`, every role it can return applies in **every**
state, including `draft` after EDIT or REJECT,
`payment` and `done`. Each of those states must define that role with a
form, or the user gets an infinite spinner. Check each returned role
against every column of the matrix, not only the states the PR touched.

Read the gaps from the matrix.

## S1. State × role gaps

- **Flag:**
  - A role added to some states but not its siblings.
  - An action whose event is missing from that state's `on`.
  - A data provider the form runs that is missing from the role's `api`,
    or whose resolved `externalDataId` is missing from `write.externalData`
    (unless `write: 'all'`).
  - `write.answers` holding a dotted path (only top-level keys match).
  - A declared role that `mapUserToRole` never returns, or that no state
    grants.
  - A review state with no reviewer role.
  - A new state with no exit.
  - A transition out of a terminal state.
  - A guard whose negation leaves no SUBMIT transition.
  - **Write lists:** a new answer key on a screen that is missing from
    that role's `write.answers`. SUBMIT drops it silently, and UPDATE
    returns 403.
  - **Unreachable forms:** a role with no `formLoader`, or a reachable user
    for whom `mapUserToRole` returns `undefined`. Both give an endless
    spinner.
  - **Stale form after SUBMIT:** a SUBMIT that changes the role's form or
    write lists, without `refetchApplicationAfterSubmit: true`.
  - **Missing or wrong status:**
    - a new state with no `meta.status` (it defaults to `draft`);
    - a waiting-for-others state left at `draft`;
    - a terminal state set to `inprogress`.
  - **Assignment:**
    - A flow expecting several assignees through `/assign`. Each accept
      replaces the list.
    - Assignee links sent in a state that has other events. Any event
      clears them.
    - An `ASSIGN` that neither changes state nor runs actions. The
      assignee is dropped.
  - **A missing button:** a new event routed to a state the form never
    offers a button for. For example, PAYMENT is allowed in `inReview`, but
    the review form shows only SUBMIT, so payment is skipped.
  - **No receipt (medium):** a SUBMIT into a state where the user defers
    work or waits, whose form opens straight on that work. The user needs a
    receipt screen first.
- **Severity:** high, unless the bullet says otherwise.
- **Precedent:** #22207, #22761, #21861, #23796, #23560, #22719, #23505, #23224.

## S2. `mapUserToRole` admits strangers

- **Flag:** `mapUserToRole` returning a role without comparing the user's
  kennitala to `application.applicant`, an assignee, or another explicit
  party.
- **Why:** it is the authorisation boundary for everyone who is not the
  applicant or an assignee.
- **Severity:** high.
- **Precedent:** #20427.

## S3. Delete permissions

- **Flag:**
  - `delete: true` on submitted, in-review, approved or completed states.
  - `delete` missing where the applicant waits on assignees.
- **Why:** pruned applications move to "eldri umsóknir" (older
  applications) anyway, so delete is rarely wanted after submit.
- **Severity:** medium.
- **Precedent:** #23237, #22492, #21017, #22372, #23527.

## S4. Payment state

- **Flag:**
  - `buildPaymentState` without an `abortTarget` in a multi-role flow.
  - **No server-side payment check before the next state:** neither a
    `VerifyPaymentApi` in the payment state's `onExit` (`triggerEvent: SUBMIT`), nor a `getPaymentStatus(...).fulfilled` check in the submit
    action.
  - A charge or amount computed from `answers`, rather than from data the
    server re-fetched.
  - **Answers editable after pricing:** the submit action delivers from
    answers (quantity, type, express) without comparing them to what was
    charged, and the payment role may still write them. Restrict the
    role's `write`, or compare.
  - **Mixed codes and amounts:** `chargeItems` mixing a dynamic `amount`
    with conditional or optional codes. Amounts are matched to codes by
    position, so every code must exist in the catalog.
  - **Re-entry:** any path back into the payment state other than ABORT
    to draft. Re-entry reuses the payment created on first entry.
  - **Refund after delivery:**
    - The state after payment is not `status: 'completed'` while delivery
      has already happened. Delete or prune then refunds.
    - A `lifecycle` override in `buildPaymentState` that drops
      `shouldDeleteChargeIfPaymentFulfilled` without saying why.
  - **Invoice protection lost:** `CreateChargeApi` configured with a
    custom `externalDataId`. Invoice-paid applications are then pruned and
    refunded.
  - **Shown vs charged price:** `getSelectedChargeItems` (what the user
    sees) differing from `chargeItems` (what is charged).
- **Severity:** high.
- **Precedent:** #22905, #20451, #22719.

## S5. Readiness and delegation config

- **Flag:**
  - A new template without `featureFlag`.
  - `readyForProduction` or an environment check used as the template's
    readiness gate.
  - A new resolver or endpoint shipped ungated.
  - **A feature flag that targets kennitölur in a template with assignees
    or co-signers.** Readiness is checked for the calling user, so those
    parties get "not ready".
  - **A side-effecting initial `onEntry`.** Creating an application runs
    it, so it must have none.
  - **A flag used only in `formLoader` to hide something that must be
    enforced.** Flags hide screens, not data.
  - `NationalRegistryUserApi` where companies or procuration holders apply;
    use `IdentityApi`.
  - Company-only flows open to individuals.
- **Severity:** high.
- **Precedent:** #23594, #23378, #23130, #21909.
- **Not covered here:** scopes and delegation scopes belong to
  `scopes.md`.

## S6. Trust boundary

- **Flag:**
  - A DTO or GraphQL input gaining a server-behaviour flag
    (`skipValidation`, `excludeAttributes`, `useMockData`).
  - Fake-data branches inside sections; route fake data through a data
    provider under the same key.
  - **Not here:** mock switches and how they are gated belong to SE9 in
    `security.md`, which also decides whether the PR or shared code owns
    the exposure.
  - User-supplied content written into `externalData`, which must hold
    trusted data only.
  - Eligibility enforced only on the client.
  - **Approvals and consents stored in answers** that any party can write,
    and read by a transition `cond`.
  - **A transition meant for one party** (applicant-only SUBMIT,
    assignee-only APPROVE) with no `cond` enforcing it. Use a `cond` over
    `event.nationalId` or server-written data.
- **Severity:** high.
- **Precedent:** #23188, #22375.

## S7. Lifecycle and deletion

- **Flag:**
  - `pruneAfter` shorter than the time another party needs (signing,
    assignee).
  - A changed lifecycle on a live template, with no note on existing
    applications.
  - A template that creates institution records before its final state, with
    no `onDelete` to withdraw them.
  - Delete or prune that clears answers but not attachments.
  - New `adminDataConfig` keys with no reason given for keeping the personal
    data.
  - **A malformed `adminDataConfig` key:** a second `.$.`, a leading `$.`,
    or a non-array before `.$.`. Pruning of that application fails.
  - **Relying on `onDelete`** to cancel external cases or release
    reservations. It runs only when a user deletes.
  - **A new state without `meta.lifecycle`.** Give every state one.
  - **A `whenToPrune` function** that reads answers without a fallback. On
    create it runs with empty answers.
- **Severity:** high when records are orphaned at an institution, or when
  pruning strands another party or a paid application (a blocked submission,
  or money). Medium otherwise, including a draft pruned sooner than its
  owner expects.
- **Precedent:** #23871, #21018, #21111, #20662.

## S8. History and pending actions

- **Flag:**
  - Approval states without `historyLogs`. Use `includeSubjectAndActor`
    so the log shows who acted. In multi-party templates make it a
    role-aware function, not `true` (see SE2).
  - `historyLogs` placed on the target state instead of the **exited**
    state, or an `onEvent` that matches no event in that state's `on`.
  - `name`, `actionCard` or `pendingAction` functions that dereference
    answers without optional chaining. They run on every listed
    application, including pruned ones with `{}`, inside one
    `Promise.all`, so one throw breaks the whole my-pages list.
  - History or pending-action text built from template strings instead of
    messages.
  - Pending-action copy that addresses "your application" to a
    non-applicant.
- **Severity:** low.
- **Precedent:** #20523, #20803, #22865, #20954.

## S9. Transition semantics

- **Flag:**
  - **Side effects before a guard:** a side-effecting `onExit`
    (submission, email, charge) in a state whose outgoing event has a
    `cond`. Move the side effect into the target state's `onEntry`.
  - **Non-idempotent xstate `entry`:** an `entry` action that appends to
    an array, or stamps a time without an "already set" check. It re-runs
    on every event.
  - **Dropped `assign` writes:** an `assign` that writes `externalData`,
    `applicantActors` or any field other than `answers`, `assignees` and
    `state`. Those writes are dropped.
  - **Renamed state keys:** a state key renamed or removed in a template
    with live applications, without a migration. Live applications break.
  - **Self-transitions with side effects:** an `EDIT`-style
    self-transition on a state whose `onEntry` charges, submits or
    notifies. It re-runs.
- **Severity:** high when external side effects or live applications are
  affected; medium otherwise.
