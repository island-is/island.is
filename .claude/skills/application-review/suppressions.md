# Suppressions

These are findings that are not wanted, with reasons. Read them before
reporting; a finding that fits one is dropped.

- **A. Trace before guarding.** Follow a value to its source before calling
  it possibly undefined, NaN or malformed. Values that are already safe:

  - values from the same generator;
  - values defaulted upstream (`?? NO`);
  - fields TS types require;
  - Sequelize `@CreatedAt`;
  - output of controlled shared inputs (number, currency, date picker,
    select, the NationalIdWithName mask).

  Guards belong on data from outside the module: APIs, clients and
  externalData.

- **B. A provider that falls back is a product decision.** Report one only
  when it blocks an eligible user or loses money.
- **C. `messages.ts` holds Icelandic `defaultMessage` only.** English and
  live copy come from Contentful. Deliberate id bumps are fine.
- **D. Generated files are read-only.** `libs/clients/**/clientConfig.json`
  and `gen/fetch` are generated. Comment on how they are consumed, not on
  their content.
- **E. The scope is the change.** Leave these alone:
  - unchanged lines the change does not break;
  - WIP the author has flagged, and reverts;
  - backward compatibility of answers for an unlaunched or just-launched
    template;
  - refactors that would touch live, unflagged code inside a flag-gated PR.
- **F. Verify before claiming.**
  - Check an import exists before calling it missing.
  - Check which overload is used.
  - Check whether `set` is lodash `set`.
  - Check that writer and reader really use different paths.
- **G. Payment and notification semantics are deliberate.** In
  `libs/application/api/payment` and notification scheduling, ask rather
  than assert about refund and notification behaviour, unless a double
  charge or a lost refund is provable. This does not apply to S4 (template
  payment configuration) or SE9.
- **H. Iceland is UTC all year.** Report a date bug only when parsing or
  comparison is inconsistent within one flow. Setting `process.env.TZ` in
  Jest has no effect here.
- **I. The `dataSchema` is event-blind.** Never suggest exempting an event
  inside zod.
- **J. Drafts may hold debug logging.** On a draft PR, skip `console.*`
  findings unless they print personal data.
- **K. Severity is earned.** High is reserved for crashes, blocked
  submission, wrong data sent to an institution, money, personal data and
  access. Everything else is medium or low.
- **L. Leave these alone as well:**
  - typos that mirror an upstream API field;
  - Icelandic wording nits, which are fixed in Contentful;
  - `institution: m.institutionName`, where the institution is displayed;
  - a custom-component rewrite, cleanup or file split the author has
    deferred to a ticket. The team accepts deferral, so record it as FYI
    and move on.
- **M. Settled decisions stand.** Do not flag behaviour that a decision in
  the review's decisions list describes. That list comes from the
  template README's `## Decisions` section, or from the user's request.
  Do flag these:
  - code that implements the decision wrongly;
  - code that contradicts it;
  - a decision missing from the README, or recorded without its reason
    (check G6).
