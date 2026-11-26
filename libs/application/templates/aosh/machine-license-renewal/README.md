# Machine License Renewal

## Description

The Machine License Renewal (Endurnýjun vinnuvélaskírteinis) application allows individual users to renew their machine license rights with The Administration of Occupational Safety and Health (Vinnueftirlitið). Rights can be renewed when six months or less remain of their validity. The applicant uploads a medical certificate, chooses whether to receive a plastic card and how it should be delivered, and pays the renewal fee.

## URLs

- [Local](http://localhost:4242/umsoknir/endurnyjun-vinnuvelaskirteinis)
- [Dev](https://beta.dev01.devland.is/umsoknir/endurnyjun-vinnuvelaskirteinis)
- [Production](https://island.is/umsoknir/endurnyjun-vinnuvelaskirteinis)

## Clients and template-api-modules

- [Client](https://github.com/island-is/island.is/blob/main/libs/clients/seminars-ver/src/lib/seminars.service.ts)
- [Template-api-module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/aosh/machine-license-renewal/machine-license-renewal.service.ts)

## States

### Prerequisites

Data fetching from National Registry, User profile, The Administration of Occupational Safety and Health (machine license rights) and the payment catalog. Applicants cannot continue if they have no machine license rights (AOSH returns an empty `workMachineRightsDtos`), or if none of their rights can be renewed yet (`hasLicenseRightsToRenew` is false). Each case has its own error message.

### Draft

The applicant goes through the following screens:

1. **Applicant:** personal information from National Registry, and email and phone number from User profile. The applicant can change the email and phone number for this application, which does not update User profile. Both are required.
2. **Rights:** the license number, the rights that will be renewed and other valid rights. The table of other valid rights is hidden when all rights are renewable. Right names are shown in English (`categoryNameEn`) when the application is in English, with the Icelandic name (`categoryName`) as a fallback. This also applies to the overview. Dates use the shared `dateFormat` for the application's language (`dd.MM.yyyy` in Icelandic, `dd/MM/yyyy` in English).
3. **Medical certificate:** upload of one medical certificate (`.pdf`, `.jpg`, `.jpeg` or `.png`). The certificate must not be older than six months. This is stated to the applicant but not validated.
4. **License:** whether the applicant wants a plastic card. If so, the card is either sent to the applicant's legal domicile or to another address with an optional recipient. The postal code for another address is selected from the shared list of Icelandic postal codes (`postalCodes` in `@island.is/shared/utils`).
5. **Overview:** summary of the application and approval of the terms of payment.

### Payment

Payment for the renewal through the payment state, with the charge item code `VJ261` (`AOSH_MACHINE_LICENSE_RENEWAL_VJ261`). Before the application moves to the submitted state, the payment is verified with island.is and The Administration of Occupational Safety and Health confirms that it has received the payment.

### Submitted

The application is submitted to The Administration of Occupational Safety and Health, including the email and phone number from the application, the medical certificate, plastic card and delivery information and the payment id. The applicant receives confirmation that the application has been received.

The delivery method (`sendToLegalAddress`) is only sent when the applicant wants a plastic card. When the card is sent to another address without a recipient, the applicant's name is sent as the recipient.

The application stays in this state while The Administration of Occupational Safety and Health processes it, and is pruned after 365 days.

The Administration of Occupational Safety and Health moves it to the approved or rejected state by calling `PUT /applications/{id}/submit` on the application system API with the event `APPROVE` or `REJECT`, authenticated with its own kennitala (`InstitutionNationalIds.VINNUEFTIRLITID`).

`mapUserToRole` maps that kennitala to the `organization` role, which can only send these two events. It has no read or write access, so the response to the call contains no answers or external data. A repeated event is refused, because neither event is valid after the first one.

### Approved

The Administration of Occupational Safety and Health has approved the application and renewed the rights.

On entry, the applicant receives a Hnipp notification (template `HNIPP.AS.VER.MLR.APPROVED`). The renewed rights with their new validity, taken from `workMachineRightsRenewedDtos` fetched in prerequisites, are sent in two arguments: `renewedRightsIs` (for example `D - Körfukranar og steypudælur (gildir nú til 15.03.2037)`) for the Icelandic template and `renewedRightsEn` (English right names, `valid until 15/03/2037`) for the English template.

A failed notification does not stop the application from moving to this state (`throwOnError: false`).

### Rejected

The Administration of Occupational Safety and Health has rejected the application, for example because documents are missing. The applicant cannot add documents in the application. The Administration of Occupational Safety and Health contacts the applicant directly.

## Feature flag

The application is behind the `isMachineLicenseRenewalEnabled` feature flag in ConfigCat.

## Localisation

All localisation can be found on Contentful.

- [Machine License Renewal translation](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/aosh.mlr.application)
- [Application system translations](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

## Test users

- **Gervimaður Færeyjar 010130-2399:** has machine license rights that can be renewed
- **Gervimaður Bandaríkin 010130-5069:** has machine license rights, but none that can be renewed
- **Gervimaður Útlönd 010130-7789:** has machine license rights, but none that can be renewed
- If more test users are required, contact The Administration of Occupational Safety and Health

## Codeowners

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)

## Running unit tests

Run `nx test application-templates-aosh-machine-license-renewal` to execute the unit tests via [Jest](https://jestjs.io).
