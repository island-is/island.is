# official-journal-of-iceland

Application template for submitting adverts and regulations for publication in
the Official Journal of Iceland (Stjórnartíðindi).

## What is this application for

Institutions use this application to send material for publication in
Stjórnartíðindi. There are three application types (`applicationType`):

| Type                  | What it is                                                                      |
| --------------------- | ------------------------------------------------------------------------------- |
| `ad`                  | An advert (auglýsing). The default, and the only type for non-ministries.       |
| `base_regulation`     | A new regulation (stofnreglugerð).                                              |
| `amending_regulation` | A regulation that amends or repeals existing regulations (breytingarreglugerð). |

### Advert flow vs regulation flow

> **Status:** the regulation flow is behind the
> `Features.officialJournalOfIcelandRegulations` feature flag and is **not
> available on production yet**. With the flag off, every application is an
> advert. The regulation flow replaces the regulations-admin portal
> (`libs/portals/admin/regulations-admin`), which will be removed once the flag
> is lifted.

The two flows share the requirements step, the signed original and the review
states, but are otherwise separate sets of screens (see the `isAdOrDefault` /
`isRegulation` conditions in `src/forms/Draft.ts`):

- **Advert flow** — the original OJOI flow, open to every involved party. The
  advert itself, attachments, a preview, the signed original, publishing
  preferences and a summary. All data lives in `application.answers`.
- **Regulation flow** — only for ministries (an involved party whose name
  contains "ráðuneyti"), which are the only ones shown the type selection
  screen. Content, attachments, the signed original, meta, preview, publishing
  preferences, impacts (which regulations it changes or repeals) and a summary.
  An amending regulation starts with its impacts, since its title is generated
  from them. Regulation-specific data (impacts, effective date, law chapters,
  fast track) lives in a draft in the regulations-admin database; the
  application only stores its `draftId` (see `src/hooks/useRegulationDraft.ts`).
  Existing regulations are looked up in the regulations API.

## Editorial rules the form follows

Publication is governed by the Act on Stjórnartíðindi and Lögbirtingablað
(nr. 15/2005). The editorial office's guidelines for submitters are at
[island.is/stjornartidindi/leidbeiningar](https://island.is/stjornartidindi/leidbeiningar).
The ones that shape this form:

- **Signed original.** Filling in the signature section is not enough — a
  signed original (frumrit) must be uploaded as a PDF, signed electronically or
  showing an ink signature.
- **Categories.** Every advert needs at least one category (efnisflokkur). The
  editors have the final say and may change them.
- **Publishing date.** The editors try to publish on the requested date, and
  only on working days. Without one, the default is 10 working days out
  (`MINIMUM_WEEKDAYS` in `src/lib/constants.ts`), skipping weekends and
  holidays.
- **Communication.** Messages to the editors go with the submission or, once
  the case is open with them, through the comments (samskiptagátt). Cancelling
  or correcting a submission is only possible from that point. Urgent matters
  go to stjornartidindi@dmr.is.
- **Notifications.** The submitter is emailed when the advert is published, and
  more addresses can be added (communication channels).

## Who can use this template

The involved party (institution) comes from the logged-in party: (`getUserInvolvedParties`).
With exactly one, it is selected automatically;
only when the login covers several institutions does the applicant choose
between them. A person can act through a procuration holder or custom
delegation, and needs the `@island.is/applications/dmr:stjornartidindi` scope. Anyone added as an
additional party in the requirements step is made an assignee and gets the
applicant view.

The Ministry of Justice (`InstitutionNationalIds.DOMSMALA_RADUNEYTID`) is the
reviewer (`assignee`). When it submits its own advert, it gets the review
actions on top of the applicant view (`ministryApplicant`).

## Organization

Ministry of Justice (Dómsmálaráðuneytið), on behalf of the Official Journal of
Iceland.

## State flow

- **`requirements`** — information about submissions, additional parties, the
  involved party and, for ministries, the application type.
- **`draft`** — the main form for the chosen type (see above). Submitting
  moves to `submitted`.
- **`submitted`** — on entry, posts the application to the Official Journal
  backend (`postApplication`). The reviewer can approve (`complete`), reject
  (`rejected`) or send it back for changes (`draft_retry`).
- **`draft_retry`** — the same form as `draft` with a comments screen added.
  Submitting moves back to `submitted`.
- **`complete`** — published (Útgefið).
- **`rejected`** — terminal. The reviewer can also reject from `draft` and
  `draft_retry`.

Every state uses `pruneAfterDays(90)`.

## Related code

- Template API module:
  `libs/application/template-api-modules/src/lib/modules/templates/official-journal-of-iceland`
- GraphQL domains: `libs/api/domains/official-journal-of-iceland-application`
  and `libs/api/domains/official-journal-of-iceland`
- Clients: `libs/clients/official-journal-of-iceland`, and for the regulation
  flow `libs/clients/regulations` and `libs/clients/regulations-admin`

## Running unit tests

Run `nx test application-templates-official-journal-of-iceland` to execute the
unit tests via [Jest](https://jestjs.io).
