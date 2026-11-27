# Form System

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-init services-form-system-api
```

To start the app:

```bash
yarn dev services-form-system-api
```

These commands are just shorthands for the setup described below.

## URLs

- [Dev](https://beta.dev01.devland.is/form/<slug>)
- [Staging](https://beta.staging01.devland.is/form/<slug>)
- [Production](https://island.is/form/<slug>)

## API

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services services-form-system-api
```

Then run the migrations:

```bash
yarn nx run services-form-system-api:migrate
```

Fetch secrets

```bash
AWS_PROFILE=islandis-dev yarn get-secrets services-form-system-api
```

### Running locally

## Create form type

You need to run the admin portal

```bash
yarn start api
yarn dev services-form-system-api
yarn dev portals-admin
```

Open localhost:4200/stjornbord -> Log in as Gervimaður Færeyjar as 65° Arctic -> go to "Umsóknasmiður" -> Create new form type -> Select Zendesk under "slóðir" -> Give the form type the status Published

## Create / view form application

You can serve this service locally by running:

```bash
yarn start api
yarn dev services-form-system-api
yarn dev form-system-web
```

Open localhost:4242/form/<slug>

## Zendesk routing

Local environments (`name` unset or `local`) and dev deployments (`name=dev`)
always send applications to the configured Zendesk sandbox, including applications
for published forms. Stored production tenants and brand IDs are ignored there,
even when `NODE_ENV=production`.

## Application JSON

Application JSON fetched via X-Road and the sample JSON downloaded from the
admin portal both include `formName`, containing the form's Icelandic (`is`)
and English (`en`) names.

## Application PDFs

Application PDFs display the organization's stored `logo.is` in the top-right
header on the first page only, regardless of the PDF language. Content starts below the
header and footer positions are unchanged. Logos are loaded from Contentful as
PNG images; organizations without an Icelandic logo produce PDFs without one.
Logo download failures are logged and do not block user or X-Road PDF downloads.

## Field content migration

The field-content migration renames `field.description` to
`field.information_text`, adds localized `field.tooltip`, and removes
`field_settings.hasDescription`. Existing text/number descriptions move to
`tooltip`; checkbox descriptions move to `field_settings.subLabel`; message
bodies remain in `information_text`. The migration preserves checkbox `isLarge`
values and clears both sublabel languages when `isLarge` is false. Text and number
descriptions become tooltips only when the original setting was enabled.
No legacy backup column is added. Rollback derives `hasDescription` from whether
the restored description has nonblank text in either language; the original flag
cannot be recovered exactly.
Only version-2 form exports are supported by `formExportSchema` and `importForm`;
version-1 imports fail validation and must be exported again using the updated service.

Apply migrations before starting the updated service. REST and GraphQL field APIs
no longer expose or accept `description` or `hasDescription`; clients use
`informationText`, `tooltip`, and `fieldSettings.subLabel`.
PDF information text and checkbox sublabels use only the requested language.
Checkbox sublabels appear on a new line directly beneath the field name, using
the same font and size inside the field's value box.
Information-text markup is converted to decoded plain text before measurement
and drawing; line breaks are preserved. Tooltips are not included in PDFs.

## Publishing and archiving forms

Publishing a form in development deletes its applications' events before deleting
the applications, within the publishing transaction. Attachment references are
cleared in that transaction, and S3 objects are deleted only after commit.
Deleting test applications follows the same post-commit storage cleanup order.
A rollback or commit failure in either operation leaves stored attachments intact.

Archiving a published form deletes its draft applications, including test drafts,
their application events, and their uploaded files. This also applies when
publishing a replacement archives the previous form version. Non-draft
applications, their events, and their files are preserved for worker pruning.

Unpublishing also deletes all forms derived from it in the
`published_being_changed` state, together with all of their applications and
application events, within the same transaction. This includes non-draft and test
applications on those revisions. Events are deleted before their applications.
Attachment keys are collected and their value references are cleared within the
archive transaction. Uploaded files are removed from storage only after the
transaction commits successfully. The confirmation
dialog always warns about revision deletion, even if the local list is stale.
Creating an editable revision also shows a toast warning that unpublishing the
original form will delete the revision.
Form responses include the revision's original form ID (`derivedFrom`) so the
admin portal also removes newly created revisions from state when unpublishing.

Draft creation locks the form row and rechecks its status and accessibility
inside the creation transaction. Archiving takes the same lock, so a concurrent
creation either commits before archiving or is rejected after the form is archived.

Draft and revision applications are locked during deletion. Submission takes the same
row lock and verifies that the application is still a draft before sending it.
The lock is held through the external send and the completed-status update.
Application and form reads during submission reuse the submission transaction.
Draft and revision attachment references are updated using the same database
transaction as application deletion. A rollback or commit failure leaves the S3
objects intact. S3 deletion errors, including a false result from the storage
service, are logged and propagated. When post-commit deletion fails, the database
cleanup remains committed; failed objects require separate storage cleanup,
not another archive attempt.
File-reference cleanup accepts both key arrays and legacy single-key strings.
It also parses stringified JSON values and preserves their other properties
when removing a key. Invalid JSON is logged and rejected without saving.

Deleting an application from the applicant's "My applications" list removes its
events and values transactionally, then deletes its uploaded S3 files after
commit. Application ownership and delegation checks still apply. A failed
transaction leaves the uploaded files intact; post-commit storage errors are
logged and propagated.

## Code owners and maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania/members)
