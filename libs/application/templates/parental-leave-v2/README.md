# Parental Leave V2 Application Template

## Description

This application template allows applicants to apply for parental leave. For further reading about application templates, have a look at [the reference template](../reference-template/README.md).

- It contains all the steps for parents and employers required to collect and confirm all information
- It handles communications with external APIs to filter out valid applicants as well as sending complete applications to Vinnumálastofnun

### Legacy coexistence

V2 uses application type `ParentalLeaveV2` and slug `faedingarorlof-v2`. The existing [parental leave application](../parental-leave/README.md) remains separate so its applications can complete their lifecycle. Application lookups are scoped to V2's own type.

### Glossary

| Word             | Description                   |
| ---------------- | ----------------------------- |
| Primary parent   | The mother carrying the child |
| Secondary parent | The other parent              |
| VMST             | Vinnumálastofnun              |

### States

This section assumes that you are familiar with [states](../../core/README.md#states).

#### Prerequisites

This state is a temporary state that all new applications will be created in. It has a short lifespan and is unlisted.

The purpose of this state is to be a guard into the actual application. There is an external data step which fetches data from VMST and Þjóðskrá. The applicant then picks the child to apply for from the children found, or picks "Ný umsókn" for a child that is not in the list. If no child is found, or "Ný umsókn" is picked, we ask whether the application is due to birth (with the date or expected date of birth), adoption or permanent foster care (with the child's birth date and placement date), or "Annað" for a parent without a birth parent in Iceland (the child is born abroad, or the birth parent lives abroad without an Icelandic national id and is not entitled to parental leave in Iceland; the applicant gives the expected date of birth and uploads a certificate in the draft). The child is created from these answers by `setChildrenInformation` when the prerequisites are submitted, with the applicant as the primary parent, or as the secondary parent for "Annað".

Applicants choose which application type ( parental-leave, parental-grant or parental-grant-students ) they are applying for. Primary parents of a born or expected child are asked if they are expecting multiple births.

The external data step also gathers what VMST holds for the applicant (`VMSTParentalLeaves`): their list of parental leaves and the VMST application of each listed leave. Picking a child that already has a leave turns the application into a change of that leave with a single submit, prefilled from this data without asking VMST again. A leave VMST holds without a V2 application behind it (applied for in V1, on paper or at VMST) is listed as a child too, when the child was born, adopted or due less than 24 months ago (`vmstLeavesToChildCandidates`). Such a child is shown with its name and the first and last day of its leave, read from this data rather than stored on the child, which the employer can read. It is kept out of `children`, which the employer can read, and cleared when the applicant leaves prerequisites.

#### Draft

Valid applicants will be able to advance to this state where they can start the actual application and fill in all the relevant data.

#### Other parent approval

When the primary parent requests days from the other parent, or the use of the spouse's personal allowance, the other parent has to approve. They get an email and SMS with a link. If they reject, the application goes back to the draft.

#### Employer waiting to assign

If the applicant is employed by an employer(s) (not self employed, getting benefits or applying for a parental-leave grant), then they are asked to provide an email address which a confirmation email will be sent to. When the employer receives the email they can click a link which automatically assigns them to the application and advances it to the next state. If the applicant has multiple employers we go back to this state after an employer has approved the request until there are no more employers.

#### Employer approval

Here the employer will have a chance to review the periods selected by the applicant as well as pension fund and union.

The employer(s) can then approve or reject, one employer at a time since just one assignee can be at one state at a time. A rejection sends the application back to the draft.

#### VMST approval

Applications that have been sent to VMST. VMST can approve, reject (back to the draft), ask for additional documents or close the application. The applicant can also take it back to the draft to edit it.

#### Additional documents required

VMST asks for additional documents while processing the application. When the applicant sends them, the application goes back to VMST.

#### Approved

Applications that have been approved by VMST. An approved application is not edited in place: changes and the residence grant are new applications (see below).

#### Closed

VMST closed the application, for example when the applicant has used all their rights or the leave has expired.

### Changes and the residence grant

A change to a leave VMST holds, or an application for the residence grant, is its own application. In prerequisites the applicant picks the child that already has a leave, which sets `applicationAction` (`change` or `residenceGrant`) and `initialQuery` (the VMST id of the leave). `verifyFollowUpLeave` checks that VMST lists that leave, and `prefillFromVMST` copies what VMST holds into the answers.

#### Edit or add periods

The change form. Applicants change periods, employers, rights transfers, payments, personal allowance or the other parent, and add periods or employers. If an applicant changes a previous employer, they will get a file upload field where they have to upload a document confirming they have left their previous place of employment.

#### Other parent approval for edits

When a change asks something of the other parent (requested days or the spouse's personal allowance), and that request or the other parent differs from what VMST holds, the other parent has to approve it. A rejection sends the applicant back to the change form.

#### Employer waiting to assign for edits

When the change concerns the employer (periods, employers or self-employment changed) and the applicant has an employer, the employer gets an email with a link that assigns them to the application. With multiple employers we come back to this state until every employer has approved.

#### Employer approval edits

Employers review the change, then approve or reject. A rejection sends the applicant back to the change form.

#### VMST approve edits

A change or residence grant that has been sent to VMST. VMST can approve, reject, ask for additional documents or close it. A rejected change goes back to the change form; a rejected residence grant goes back to the residence grant form.

#### Additional documents required for edits

VMST asks for additional documents while processing a change. When the applicant sends them, the change goes back to VMST.

#### Residence grant no birthdate

Applicant tries to apply for the residence grant before the child is born, so they cannot apply yet.

#### Residence grant

If the applicant has given birth and it has been less than 6 months they can apply for residence grant.

### Application rules

- **Rejections:** a rejection by the other parent, the employer or VMST sends the applicant back to the draft, the change form or the residence grant form, records who rejected it in `rejectedBy`, and notifies the applicant through Hnipp (`ParentalLeaveRejected`, template `HNIPP.AS.PL.REJECTED`).
- **Deleting:** the applicant can delete the application until VMST holds it (`hasBeenSubmittedToVMST` in `parentalLeaveTemplateUtils.ts`). The first VMST id is kept in `sentToVMST`, so a failed resend cannot bring the delete button back.
- **Pruning:** prerequisites after 7 days; the draft, the change form and the residence grant forms after 90 days; every other state after 30 days (`DefaultStateLifeCycle`).
- **Re-approval of a change:** the other parent is asked only when the change asks something of them (requested days or the spouse's personal allowance) and that request or the other parent differs from what VMST holds (`requiresOtherParentApprovalForEdits`). The employer is asked only when the applicant has an employer and the periods, employers or self-employment changed (`hasEmployerRelevantChange`). Both compare against what VMST holds (`getChangeBaseline`).
- **Rights transfers in a change:** the change form is prefilled with the days VMST holds as requested (the `FSAL-GR` right) or given (the full personal right less VMST's personal right). A changed transfer adjusts VMST's rights (`getVMSTRightsWithTransfer`) for both the periods limit and the rights sent to VMST.
- **The other parent:** cannot be the applicant (`otherParentValidationSection`). The other parent in the answers is sent to VMST; VMST's stored one is only the fallback.
- **Periods:**
  - A period may not start or end inside another period (`dateIsWithinOtherPeriods`).
  - A period shorter than 14 days must start the day after another period ends. This is checked for the whole plan on Continue from the periods screen and again in `validateApplication` before anything is sent to VMST.
  - A period that has started can only be deleted if VMST has not approved it, it started this month and it is before the 24th (`formatPeriods`).
- **Mock data:** outside production the applicant can choose mock data, which never calls VMST (`shouldUseMockData` in the template API module). A sent mock application holds `MOCK_APPLICATION_FUND_ID`. Mock data is never used in production.

### Parental leave template API module

For async actions that require server side logic we have the template api modules. The module for this application contains email templates as well as external actions like `sendApplication`.

Have a look at [the parental leave V2 template API module](../../template-api-modules/src/lib/modules/templates/parental-leave-v2/parental-leave.module.ts) for further information on these actions, and [template API module README](../../template-api-modules/README.md) to get up to speed on template api modules.

### API and X-Road

All user interactions go through our GraphQL API (`api`) which is integrated with with other APIs.

To communicate with VMST a request has to go through [X-Road](../../../../handbook/technical-overview/x-road/straumurinn-usage-and-operation.md). Both in development and on production environments.

To connect to VMST test API you'll want to start the [local proxy](../../../../README.md#running-proxy-against-development-service) (also see [AWS secrets](../../../../handbook/repository/aws-secrets.md#getting-started)).

See [directorate of labour graphql API module](../../../api/domains/directorate-of-labour/src/lib/directorate-of-labour.module.ts) for examples of VMST communication.

### Localisation

All localisation can be found on Contentful.

- [Parental leave V2 application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/plv2.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

V2 uses the independent `plv2.application` namespace. Before launch, copy the existing `pl.application` Contentful namespace, preserve its localized values, change the namespace and message keys to `plv2.application`, and publish the new entry. The legacy namespace must remain unchanged. The message extraction command does not copy existing localized translations.

{% hint style="warning" %}
When creating new text strings in the messages.ts file for the application, be sure to update Contentful, see [message extraction](../../../localization/README.md#message-extraction).
{% endhint %}

### Emails

As previously mentioned, the application sends out emails to applicants and assignees. The email templates are stored in the parental leave api template module.

When developing locally you’ll see preview links for would-be emails where you can see how they would be rendered and click links.

## Setup

See [application-system](../../../../apps/application-system/README.md) setup on how to get started.

To run the application system you'll need to run three apps:

- `application-system-api`
  - Fetch secrets using: `yarn get-secrets application-system-api`
- `api`
  - Fetch secrets using: `yarn get-secrets api`
- `application-system-form`

Once you have everything running you can navigate to [http://localhost:4200/umsoknir/faedingarorlof-v2](http://localhost:4200/umsoknir/faedingarorlof-v2) and start developing.

### Local database

By setting up the application-system you'll have created a local postgres database on a docker image, if you haven't already you should setup a tool to interact with your database. For example [pgAdmin](https://www.pgadmin.org/download/).

You’ll find the relevant connection information in [the docker compose file](../../../../apps/application-system/api/docker-compose.base.yml).

## Investigating errors

When investigating errors on our enviornments we have two logging services. `Datadog` for backend services and `Sentry` for the client.

### Datadog

- env: `dev` | `staging` | `prod`
- service: `api` | `application-system-api`

### Sentry

- Can select `dev` / `staging` / `prod` from the environment dropdown
- Can filter by url with id to find a single application experiencing errors
  - `url:https://island.is/umsoknir/:id`

## Future work

### Screens for users that are no longer assignees

When the application is opened/refreshed by a user that was an assignee but no longer is, we might want to show them something - we get their national registry id so we could see if it is the other parent visting or the employer, even though they are not an assignee anymore and show them something relevant like "The application is no longer in a state you can interact with". This is too specific for the application system to know and handle, although the application system should show some message to a user visiting an application that is not an assignee.

### Localisation in emails and SMS

Emails and SMS messages are currently hardcoded in Icelandic, as in V1. They need localisation functions passed in to be able to use translation strings, and need to sync with service-portal to know what locale the user prefers.

### Other parent asks for personal allowance

Other parent should be able to ask the primary parent for personal allowance. Now only primary parent can ask the other parent for personal allowance.

### Non-custodial parent

If primary parent doesn't give non-custodial parent consent that they is allowed right of access during the parental leave (grant) they should not be able to apply for parental leave (grant).
