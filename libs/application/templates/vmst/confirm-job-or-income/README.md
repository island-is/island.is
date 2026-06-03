# Confirm Job or Income (Tilkynna um vinnu eða tekjur)

## About

This application allows individuals receiving unemployment benefits from **Vinnumálastofnun** (Directorate of Labour) to report any work or income they have alongside those benefits. Users select an income type and fill in a repeater form with relevant details such as employer, dates, and estimated income. All paid work must be reported to Vinnumálastofnun, whether it's permanent employment, part-time work, or casual labor.

**Organization:** Vinnumálastofnun
**Code owner:** Origo

## Gervimenn

Anna Mary ÞÍ Ívarsdóttir - 2011651489, phone: 201-1489
Note: Gervimenn must have an active unemployment case registered at Vinnumálastofnun to pass the eligibility check.

## State flow

```
PREREQUISITES ──(SUBMIT)──▶ DRAFT ──(SUBMIT)──▶ COMPLETED
```

| State             | Description                                                                                                    | API action                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **PREREQUISITES** | Checks eligibility via Vinnumálastofnun and fetches available pension funds. User must approve data gathering. | `canReportWork`, `getPensionFunds` (on entry) |
| **DRAFT**         | User selects an income type and fills in a repeater with relevant details (employer, dates, amounts, etc.).    | `submitApplication` (on exit)                 |
| **COMPLETED**     | Read-only confirmation screen. The report is now accessible on My Pages.                                       | —                                             |

- Applications can be deleted in PREREQUISITES, DRAFT, and COMPLETED states.
- Prerequisites applications are pruned after 1 day (not shown in listings).
- Draft and completed applications are pruned after 30 days.
- Only the applicant can access their own application.

## Data schema

| Field                                | Type                                   | Validation                                                                                                |
| ------------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `typeOfIncome`                       | `string`                               | Required. One of: `casualWork`, `partTime`, `contractWork`, `pension`, `capitalIncome`, `socialInsurance` |
| `registerIncome`                     | `array of objects`                     | Min 1 entry                                                                                               |
| `registerIncome[].company`           | `{ nationalId: string, name: string }` | Optional, used for casual work and part-time                                                              |
| `registerIncome[].monthFrom`         | `string`                               | Optional, used for casual work                                                                            |
| `registerIncome[].monthTo`           | `string`                               | Optional, used for casual work                                                                            |
| `registerIncome[].estimatedIncome`   | `string`                               | Optional, used for casual work and part-time                                                              |
| `registerIncome[].jobStart`          | `string`                               | Optional, used for part-time                                                                              |
| `registerIncome[].workPercentage`    | `string`                               | Optional, used for part-time                                                                              |
| `registerIncome[].contractJobStart`  | `string`                               | Optional, used for contract work                                                                          |
| `registerIncome[].workEnds`          | `string`                               | Optional, used for contract work                                                                          |
| `registerIncome[].pensionFund`       | `string`                               | Optional, selected from pension funds fetched from Vinnumálastofnun                                       |
| `registerIncome[].amountPerMonth`    | `string`                               | Optional, used for pension, capital income, and social insurance                                          |
| `registerIncome[].paymentType`       | `string`                               | Optional, used for capital income (rent/dividend/interest)                                                |
| `registerIncome[].paymentFrequency`  | `string`                               | Optional, used for capital income and social insurance (oneTime/monthly)                                  |
| `registerIncome[].socialPaymentType` | `string`                               | Optional, used for social insurance (disability/rehabilitation)                                           |

Fields shown in the form are conditional based on the selected `typeOfIncome`. Only the relevant fields for each income type are displayed and required.

## Running unit tests

Run `nx test confirm-job-or-income` to execute the unit tests via [Jest](https://jestjs.io).
