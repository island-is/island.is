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

## Application PDFs

Application PDFs display the organization's stored `logo.is` in the top-right
header on the first page only, regardless of the PDF language. Content starts below the
header and footer positions are unchanged. Logos are loaded from Contentful as
PNG images; organizations without an Icelandic logo produce PDFs without one.
Logo download failures are logged and do not block user or X-Road PDF downloads.

## Publishing and archiving forms

Publishing a form in development deletes its applications' events before deleting
the applications, within the publishing transaction.

Archiving a published form deletes all of its draft applications, including test
drafts, their application events, and their uploaded files. This also applies when publishing a replacement
archives the previous form version. Non-draft applications are retained.

Unpublishing also deletes the form derived from it in the
`published_being_changed` state, within the same transaction. The confirmation
dialog warns the user before deleting that revision.
Creating an editable revision also shows a toast warning that unpublishing the
original form will delete the revision.
Form responses include the revision's original form ID (`derivedFrom`) so the
admin portal also removes newly created revisions from state when unpublishing.

Draft creation locks the form row and rechecks its status and accessibility
inside the creation transaction. Archiving takes the same lock before draft
cleanup, so a concurrent creation either commits before cleanup or is rejected
after the form is archived.

Draft applications are locked during archive cleanup. Submission takes the same
row lock and verifies that the application is still a draft before sending it.
The lock is held through the external send and the completed-status update.
Application and form reads during submission reuse the submission transaction.
Draft file keys are collected during database cleanup; S3 objects are deleted
only after the archive transaction commits, without updating deleted values.
Storage deletion errors are logged and surfaced after commit; the database
cleanup remains committed.

## Code owners and maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania/members)
