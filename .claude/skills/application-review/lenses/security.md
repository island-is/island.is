# Lens: security and personal data

This is a security pass shaped to the application system. The same checks
apply whatever the template:

- the user writes the answers and the API inputs;
- the browser receives what a role may read;
- several parties (applicant, assignee, reviewer, delegate) share one
  application.

These checks live in other lenses. Do not repeat them here:

- S4: payment checks and amounts taken from answers;
- S6: the trust boundary (client flags, approvals in answers, single-party
  transitions);
- T4: personal data in logs and URLs;
- T6: file types and sizes forwarded to institutions;
- SC7: resolvers without `@Scopes`;
- U4: a custom uploader where `buildFileUploadField` fits.

Mock switches and environment gates live **here**, in SE9.

## Step 1: abuse cases

For each new resolver, controller endpoint, template-api action, role or
upload in the diff, ask how three people could misuse it:

- **an applicant** acting on someone else's data;
- **an assignee or other party** reading or changing what isn't theirs;
- **a stranger** who knows an application id.

The step is done when every new entry point has an answer, even "nothing
reachable".

## Step 2: checks

### SE1. Identity and ownership taken from the client

- **Flag:** server code that takes a kennitala, application id, file key or
  record id from GraphQL args, a DTO body or `answers`, then fetches or
  acts on it without tying it to the caller. Examples:

  - a resolver arg `nationalId` used for a registry or institution lookup;
  - an S3 key read from answers and passed to a presign, download or
    delete call;
  - a second application id loaded by id.

  Identity comes from `@CurrentUser()` or `auth.nationalId`. A file must be
  in `application.attachments` of an application the caller can access.

  Also flag:

  - **Attachment URLs:** any code the diff adds or edits that presigns,
    reads or deletes by a URL taken from `attachments` or answers without
    checking the bucket and the `<applicationId>/` prefix. When the diff
    routes files through a shared reader on a new path, read the reader and
    say what it verifies. Do not call the path safe without that.
  - **Unverified client lookups:** a submit or onExit action that trusts
    an id, price, owner or eligibility the client picked through
    AsyncSelect, `loadItems` or a `*Validation` query. Those run outside
    application-system-api, so re-fetch on the server.
  - **Endpoints with no ownership check:** a new endpoint keyed only by
    application id, or a new route or callback with no auth guard.
  - **Delegation-guard changes:** any edit to `DelegationGuard` typeId
    resolution, `findOneByIdAndNationalId`, or `@BypassDelegation` on an
    `:id` route.

- **Severity:** high.
- **Precedent:** #20422.

### SE2. What reaches the browser, and whom

A role with `read: 'all'` or `write: 'all'` receives every answer and
**all** of `externalData` (see framework-rules, Access).

- **Flag:**
  - A data provider or action that returns a whole upstream response
    (`return response`, `return { ...data }`). Return only the fields the
    form uses. Everything returned is stored, sent to the browser and kept
    until pruning.
  - A non-applicant role (assignee, reviewer, other parent, spouse,
    delegate) given `read: 'all'` or `write: 'all'` on an application whose
    externalData holds the applicant's tax, health, financial or family
    data. List what that role can now see.
  - New answers or externalData that store personal data the flow does not
    need: a full registry record when a name is enough, or other people's
    kennitölur "for later".
  - **Card text with unreadable answers:** an `actionCard`
    title or description, `pendingAction`, `name` or `historyLogs`
    `logMessage` that interpolates answers some viewing role cannot read.
    Every viewer sees this text, admins included.
  - **`includeSubjectAndActor: true` set unconditionally** in a
    multi-party template. It shows other parties' names to every viewer.
  - **Files private to one party** in a multi-party template. Say how the
    other parties are kept from them.
- **Severity:** high when another party, or the browser, receives health,
  financial or third-party personal data. Medium for over-fetching the
  applicant's own data.
- **Precedent:** #21861, #23188.

### SE3. HTML and markdown injection

- **Flag:**
  - A new `dangerouslySetInnerHTML` with no allowlist sanitizer.
  - User or external text interpolated into a `#markdown` message, an HTML
    or PDF template, or an email body.
  - Rich-text editor output stored and then rendered to another person
    (staff, the other party).
- **Severity:** high when one user's text renders for another user;
  medium otherwise.
- **Precedent:** #20218, #23142.

### SE4. Error details shown to the user

- **Flag:** a `TemplateApiError` summary, GraphQL error or alert built from
  an upstream body, `error.message`, a stack, or an institution's raw
  error text. Log the details; show the user a message descriptor.
- **Severity:** medium.

### SE5. Secrets

- **Flag:**
  - API keys, tokens, client secrets or passwords as literals in code,
    tests, fixtures or config defaults.
  - Infra values that belong in `.secrets({...})` placed in `.env({...})`.
  - A real kennitala that is not a test person (gervimaður) in fixtures.
- **Severity:** high. A secret pushed to a remote is compromised. It must
  be rotated, not just deleted.

### SE6. Uploads and scanning

- **Flag:**
  - A new `buildFileUploadField` with no `uploadAccept` and no `maxSize`.
  - Template code that forwards attachments to an institution or another
    person without checking the scan status and file type on the server.
- **Severity:** high when files reach an institution or another person
  through the template's own S3 read; medium otherwise. A template that
  forwards files through the shared reader, unchanged, gets one FYI line,
  not a finding.

### SE7. Audit trail

- **Flag:**
  - A new GraphQL resolver that returns personal data without `@Audit`.
  - A new template-api action that fetches financial, health or
    third-party data with no `AuditService.audit` call. Ask whether it
    should be audited.
- **Severity:** medium for resolvers; low (a question) for actions.

### SE8. User-influenced server fetches

- **Flag:** server code that fetches a URL taken from answers, externalData
  or a client input. Allowlist the host, and refuse redirects.
- **Severity:** high.

### SE9. Gates for mock and test paths

Behaviour that must stay off in production is gated on explicit
configuration that is off by default.

Judge only what the diff adds or changes. Code the PR merely calls is not
its finding.

- **Flag in the PR:**
  - **A server-side environment guard** added or changed in the diff,
    protecting a mock, test or bypass path.
  - **A new mock switch** that server code reads from user-writable
    answers.
  - **A mock provider the template runs on the server** outside local
    development. Rate it by what the mock writes: fake display data is
    medium, while anything that feeds a charge or a submission is high.
- **Leave alone in the PR (client-side gates):** a browser-side check
  that hides a mock control, such as a hidden input or the shell's mock
  checkbox.
- **Fix:** gate on explicit server configuration that is off in
  production, plus a per-template opt-in.
- **Severity:** high when the PR introduces or widens a bypass of payment,
  validation or access. Medium for fake data reaching prod.

## Step 3: changes that need sign-off

List these in the report as **FYI: security-sensitive changes**, so a human
looks at them even when no check fired:

- a new external integration;
- a new category of personal data stored;
- a new upload handler;
- a new role with `read` or `write: 'all'`;
- a new delegation type;
- a change to `adminDataConfig` or lifecycle retention.
