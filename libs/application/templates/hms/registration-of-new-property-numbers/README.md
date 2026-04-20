# Registration of New Property Numbers

## Overview

This application enables users to register new property numbers. Properties associated with the logged-in user are fetched during the prerequisite step. Users select the property for which they wish to register additional property numbers and specify the quantity. Payment is required for each new property number. After submission, the application is processed by HMS and then forwarded to a district commissioner. Island.is manages only the selection and payment processes.

## URLs

- [Local](http://localhost:4242/umsoknir/skraning-fasteignanumera/)
- [Development](https://beta.dev01.devland.is/umsoknir/skraning-fasteignanumera)
- [Production](https://island.is/umsoknir/skraning-fasteignanumera/)

## Related Code

- [Client Implementation](https://github.com/island-is/island.is/tree/main/libs/application/template-api-modules/src/libs/clients/hms-application-system/src/index.ts)
- [Template API Module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/hms/registration-of-new-property-numbers/registration-of-new-property-numbers.service.ts)

## Application States

### Prerequisite

- Fetches user information and properties from HMS.
- Includes a screen for accepting HMS's terms and conditions.

### Draft

- User confirms applicant information and assigns a contact.
- Selects the property and specifies the number of new property numbers.
- Optionally adds comments.
- Reviews all information before proceeding to payment.

### Payment

- Island.is payment service step

### Completed

- User submits the application.
- HMS processes the application and forwards it to the district commissioner.

## Localization

All localization is managed via Contentful:

- [Registration of New Property Number Translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ronp.application)
- [Application System Translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test Users

- **Gervimaður Færeyjar** `010130-2399`

Use Gervimaður Færeyjar for individual testing. For company delegation, use "Hugbúnaðarhús Daníels ehf." (Gervimaður Færeyjar has that procuration)

## Codeowners

- [Origo Team](https://github.com/orgs/island-is/teams/origo)
  - [Baldur Óli](https://github.com/Ballioli)
