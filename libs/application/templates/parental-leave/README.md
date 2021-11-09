# Parental leave application

## Description

This application template allows applicants to apply for parental leave. For further reading about application templates, have a look at `libs/application/templates/reference-template/README.md`.

- It contains all the steps for parents and employers required to collect and confirm all information
- It handles communications with external APIs to filter out valid applicants as well as sending complete applications to Vinnumálastofnun

Below you'll find a flow chart for the application

[Flow chart]

### Glossary

| Word             | Description                   |
| ---------------- | ----------------------------- |
| Primary parent   | The mother carrying the child |
| Secondary parent | The other parent              |
| VMST             | Vinnumálastofnun              |

### States

This section assumes that you are familiar with [states](https://docs.devland.is/libs/application/core#states).

#### Prerequisites

This state is a temporary state that all new applications will be created in. It has a short lifespan and is unlisted.

The purpose of this state is to be a guard into the actual application. To advance to the next state, an applicant will need to be expecting a child. To verify this, there is an external data step which fetches data from VMST and Þjóðskrá.

#### Draft

Valid applicants will be able to advance to this state where they can start the actual application and fill in all the relevant data.

#### Other parent approval

When the primary parent requests transferal of rights, then the other secondary parent will need to approve of the transfer. The other parent will receive an email with a link to approve of this request.

#### Employer waiting to assign

If the applicant is employed by an employer (not self employed), then they are asked to provide an email address which a confirmation email will be sent to. When the employer receives the email they can click a link which automatically assigns them to the application and advances it to the next state

#### Employer approval

Here the employer will have a chance to review the periods selected by the applicant as well as pension fund and union.

The employer can then approve or request changes

#### Vinnumalastofnun approval

Applications that have been sent to VMST

### Parental leave template API module

For async actions that require server side logic we have the template api modules. The module for this application contains email templates as well as external actions like `sendApplication`.

Have a look at `libs/application/template-api-modules/src/lib/modules/templates/parental-leave/parental-leave.module.ts` for further information on these actions, and `libs/application/template-api-modules/README.md` to get up to speed on template api modules.

### API and X-Road

All user interactions go through our GraphQL API (`api`) which is integrated with with other APIs.

To communicate with VMST a request has to go through [X-Road](https://docs.devland.is/technical-overview/x-road). Both in development and on production environments.

To connect to VMST test API you'll want to start the [local proxy](https://docs.devland.is/#running-proxy-against-development-service) (also see [AWS secrets](https://docs.devland.is/repository/aws-secrets#getting-started)).

See `libs/api/domains/directorate-of-labour/src/lib/directorate-of-labour.module.ts` for examples of VMST communication.

### Localisation

All localisation can be found on Contentful.

- [Parental leave application translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/pl.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

{% hint style="warning" %}
When creating new text strings in the messages.ts file for the application, be sure to update Contentful, see [message extraction](https://docs.devland.is/libs/localization#message-extraction).
{% endhint %}

### Emails

As previously mentioned, the application sends out emails to applicants and assignees. The email templates are stored in the parental leave api template module.

When developing locally you’ll see preview links for would-be emails where you can see how they would be rendered and click links.

## Setup

See [application-system](https://docs.devland.is/apps/application-system) setup on how to get started.

You'll want to start the `application-system-api` and `api` with these env variables to form the correct X-Road requests:

- `XROAD_BASE_PATH_WITH_ENV=http://localhost:8081/r1/IS-DEV`
- `XROAD_VMST_MEMBER_CODE=10003`
- `XROAD_VMST_API_PATH=/VMST-ParentalLeave-Protected/ParentalLeaveApplication-v1`
- `XROAD_CLIENT_ID=IS-DEV/GOV/10000/island-is-client`

Then you'll also want these env variables:

- `VMST_API_KEY`: to communicate with the VMST API, found in AWS parameter store
- `CONTENTFUL_ACCESS_TOKEN`: to fetch translations, found in Contentful

Then also start `application-system-form`.

Once you have everything running you can navigate to `http://localhost:4200/umsoknir/faedingarorlof` and start developing.

### Local database

By setting up the application-system you'll have created a local postgres database on a docker image, if you haven't already you should setup a tool to interact with your database. For example [pgAdmin](https://www.pgadmin.org/download/).

You’ll find the relevant connection information in `apps/application-system/api/docker-compose.base.yml`.

## Future work

### Screens for users that are no longer assignees

When the application is opened/refreshed by a user that was an assignee but no longer is, we might want to show them something - we get their national registry id so we could see if it is the other parent visting or the employer, even though they are not an assignee anymore and show them something relevant like "The application is no longer in a state you can interact with". This is too specific for the application system to know and handle, although the application system should show some message to a user visiting an application that is not an assignee, currently they just see a loader (they could be anyone).

### Rights code

Currently other parents have the rights code `FO` (`FOreldri` -> parent). The API we use from Þjóðskrá does not provide gender but we'll need to include this for statistics on other parents.
