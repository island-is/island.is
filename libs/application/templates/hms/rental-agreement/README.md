# Rental Agreement application

## About

This application allows individuals to create a rental agreement between one or more landlords and tenants that ends in a signature of all required parties and is then registered with the rental registry (leiguskrá Húsnæðis- og Mannvirkjastofnunar).

### Earliest rental period start date

`EARLIEST_RENTAL_PERIOD_START_DATE` (`src/utils/utils.ts`) is set to 2023-01-01. This is a floor mandated by HMS: rental agreements, and the dates on fields tied to them (e.g. meter reading dates), cannot be set earlier than this. It is also used as the anchor for how far back the consumer price index (vísitala) is fetched from Hagstofa, so that any agreement back to this date can find a matching index value.

### Latest rental period start date

`getLatestRentalPeriodStartDate` (`src/utils/utils.ts`) caps the start date at `MAX_RENTAL_PERIOD_START_MONTHS_AHEAD` (1) month from today. The date picker limits selection, and `rentalPeriodSchema` rejects later dates. The data schema only validates the answers sent in each request, so `submitApplicationToHmsRentalService` (template-api-modules) checks the stored start date again before sending the agreement to HMS. Requested by HMS: index-linked agreements need the consumer price index (vísitala) value for the start month, and Hagstofa only publishes it shortly beforehand. Agreements starting further ahead fail when registered in the rental registry (leiguskrá).

### Who can act while the agreement is in review

When the applicant sends the draft to review (`inReview`), all landlords and tenants on the agreement are set as assignees (`getAssigneesNationalIdList`). Everyone except the applicant then gets the `ASSIGNEE` role. Confirmed with HMS:

- Only the applicant (`APPLICANT`, or `DELEGATE` when acting on their behalf) can go back and edit or send the agreement to signing.
- Assignees get a read-only view of the contract (`inReviewAssigneeForm`) with no actions. They can only read the contract answers, not the applicant's external data, so overview helpers fall back to `answers` (e.g. `parties.applicant.name`) when external data is missing.
- Landlord representatives (`parties.landlordInfo.representativeTable`) are the tenant's contact during the lease and are not assignees, so they have no access to the application.

## URLs

> [!NOTE]
> Project is still only on DEV.

- [Dev](https://rental-agreement-application-beta.dev01.devland.is/umsoknir/leigusamningur)
- [Staging](https://beta.staging01.devland.is/umsoknir/leigusamningur)
- [Production](https://island.is/umsoknir/leigusamningur)

## Setup

Follow [this guide](https://docs.devland.is/development/getting-started) to set up the application system startup environment

## Running locally

### AWS secrets

Get the AWS environment variables from https://island-is.awsapps.com/start to be able to upload documents while running locally

- Choose island-is-development01 --> Access Keys
- Copy AWS environment variables under "Option 1: Set AWS environment variables"
- Paste in terminal before running each of:

```bash
kubectl -n socat port-forward svc/socat-xroad 8080:80
```

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

```bash
kubectl port-forward svc/socat-soffia 8443:443 -n socat
```

### Docker containers:

- islandis-shared --> redis_cluster
- islandis-application-system --> db_application_system
- user-profile --> db_user_profile

### Start dev services:

In terminal log in to AWS:

```bash
aws sso login
```

then run the server:

```bash
yarn start application-system-form
```

and visit `http://localhost:4242/umsoknir/leigusamningur`

## Test users

You can use any gervimaður to go through the appplication on DEV

### Localisation

When creating new text strings or making changes in the messages.ts file for the application, be sure to update Contentful by running:

```bash
yarn nx run application-templates-rental-agreement:extract-strings
```

For more info see [message extraction](../../../localization/README.md#message-extraction).

## Project owner

- [Húsnæðis- og mannvirkjastofnun](http://www.hms.is)

## Code owners and maintainers

- [Kolibri Kotid](https://github.com/orgs/island-is/teams/kolibri-kotid)
