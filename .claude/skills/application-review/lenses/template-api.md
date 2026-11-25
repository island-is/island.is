# Lens: submit path, errors, logging, integrations

Severity is high on false success, duplicates at the institution, lost
writes, personal data in logs, or a submission that fails at production
volume. It is medium otherwise.

## T1. False success and duplicates

- **Flag:**
  - "Already done" logic that tests `externalData.<action>` for presence
    rather than `.status === 'success'`. A failed action is written too.
  - `Promise.all` over side-effecting institution writes.
  - `forEach(async …)`, or an unawaited `Promise.all` / `allSettled`.
  - A secondary step (email, notification) inside the submit's `try`.
  - Submit in `onExit` with a `triggerEvent`; it belongs in the next state's
    `onEntry`.
  - Errors swallowed with `.catch(() => undefined)` or a bare `return`.
  - An idempotency flag (`sent: true`) saved when every send failed.
  - One id landing in both the success and failure sets.
  - **No dedupe key or prior-success check** on a non-idempotent external
    write (filing, charge, sending). The form's Apollo client retries
    network errors up to five times, mutations included.
  - **`throwOnError: false` on an action whose output a later step reads.**
    The transition proceeds with a failure entry.
- **Severity:** high.
- **Precedent:** #23538, #20523, #23905, #20150, #20319, #22253, #22796.

## T2. Submit trusts what it was given

- **Flag:** a submit action that sends `answers` without re-checking the
  required sections or eligibility. Payment checks belong to S4.
- **Severity:** high.
- **Precedent:** #23263.

## T3. Errors the user cannot read

- **Flag:**
  - `throw new Error(...)` or a raw rethrow on a user-facing path.
  - A `TemplateApiError` with string `title` or `summary` instead of
    message descriptors.
  - An error code read from the wrong field of a problem body.
  - A `catch` that logs without the error object.
  - A catch that logs "not rethrown" and then rethrows.
  - A refactor that drops tolerated error codes.
  - Several external calls with no partial-failure handling.
  - **An error reason not shaped `{ title, summary }`.** Any other shape
    shows the generic message. `values` are read only from `summary`.
  - **A message from a namespace the template does not load.** Shared
    modules must use `coreErrorMessages`.
- **Severity:** medium; high when a payment or deletion path breaks.
- **Precedent:** #20532, #22085, #22372, #23542, #21838, #21841, #22020.

## T4. Personal data in logs and URLs

- **Flag:**
  - `console.log` or `console.dir` of answers, externalData or models.
  - A logger call carrying a whole request or response body.
  - Logs of names, file names, emails or addresses (do not log them).
  - A kennitala in a URL path or query; send it in a header.
- **Severity:** high.
- **Precedent:** #23559, #21177, #21630, #23008, #20422.

## T5. Leftover debug output

- **Flag:** `console.*` where a logger is injected, commented-out code
  (above all a commented-out provider or `.configure` call),
  `// trigger deploy`, and merge markers.
- **Severity:** low; medium for a commented-out provider or configure call.
  Skip on drafts (Suppressions J).
- **Precedent:** #20676, #21890, #20695.

## T6. Integration limits

- **Flag:**
  - Parallel file uploads to an institution.
  - An unpaged fetch (`pageSize: 100000`).
  - A `maxSize` above the receiving API's limit.
  - A file type taken from the MIME type.
  - A bulk or async endpoint used for a single item.
  - Duplicate files sent.
  - A new client used without its infra `serviceSetup` and config.
  - A hand-edited `clientConfig.json`.
  - **A `buildFileUploadField` `maxSize` above 10 MB.** The presigned upload
    caps at 10 MB.
  - **Forwarding files without checking for empty content.**
  - **Two `saveAttachmentToApplication` calls in the same `order` group.**
    Run them in sequence.
- **Severity:** high; these break at production volume.
- **Precedent:** #21785, #21386, #22394, #23977, #23190, #23710.

## T7. Service wiring

- **Flag:**
  - Per-request state (locale, user, `formatMessage`) assigned to `this` on
    an `@Injectable()` service.
  - A service that does not call `super(ApplicationTypes.X)`, or whose
    shared-API namespace does not match `defineTemplateApi`.
  - A module not registered in `templates/index`.
  - Additions to deprecated clients (the SIA `deprecated/` service).
- **Severity:** medium.
- **Precedent:** #22587, #21875.

## T8. Notifications

- **Flag:**
  - New `emailGenerators` or `sendEmail` calls for applicant or party
    notifications. The guideline is Hnipp, unless email is required.
  - **Shared `sendNotification` meant for the applicant,** but fired by an
    assignee's event. It goes to whoever fired the action.
  - **Reminders expected to reach an assignee.** Prune and scheduled
    notifications reach only the applicant or `applicantActors`.
  - **A notification sent to `application.applicant` alone (medium).**
    In a delegated application that is the company or the represented
    person; the people acting are in `applicantActors`. Send to each actor
    with `onBehalfOf: { nationalId: applicant }`, and to the applicant only
    when there are no actors (#21537 ← #17029).
  - **SMS to numbers that may be foreign.** Check the number format.
  - **An email failure that blocks submit,** where submit should succeed
    anyway (`throwOnError` defaults to `true`).
- **Severity:** low, unless a bullet says otherwise.
- **Precedent:** #20523, #20540, #21537.

## T9. Actions run as the caller

- **Flag:**
  - **Shared provider under another party:** a shared provider (national registry,
    identity, user profile) in a non-applicant role's `api` list, or in an
    onEntry/onExit reachable by a non-applicant event, without a distinct
    `externalDataId`. It runs with the caller's `auth`.
  - **Initial-state `onEntry`:**
    - `triggerEvent: SUBMIT` on the initial state's `onEntry`. It fires at
      create.
    - Any initial-state `onEntry` that relies on `throwOnError`. Create
      ignores failures.
  - **Ordering mistakes:**
    - Actions in the same `order` group that read each other's
      externalData. They run in parallel.
    - A negative or fractional `order`, which runs last.
  - **A throwing `externalDataId` function,** or one that reads user fields
    other than `profile.nationalId`. The whole run is lost.
  - **An action that returns a raw upstream payload.** It is stored and sent
    to every `read: 'all'` role.
- **Severity:** high when another party's data is overwritten or a side
  effect fires unexpectedly; medium otherwise.
