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

| State             | Description                                                                                                                     | API action                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **PREREQUISITES** | Checks eligibility via Vinnumálastofnun and fetches available pension funds and income types. User must approve data gathering. | `canReportWork`, `getPensionFunds`, `getIncomeTypes` (on entry) |
| **DRAFT**         | User selects an income type and fills in a repeater with relevant details (employer, dates, amounts, etc.).                     | `submitApplication` (on exit)                                   |
| **COMPLETED**     | Read-only confirmation screen. The report is now accessible on My Pages.                                                        | —                                                               |

- Applications can be deleted in PREREQUISITES and DRAFT states.
- Prerequisites applications are pruned after 1 day (not shown in listings).
- Draft and completed applications are pruned after 30 days.
- Only the applicant can access their own application.

## Data schema

The schema uses separate arrays for each income type. Only the array matching the selected `typeOfIncome` is populated.

| Field          | Type     | Validation                                                                                                |
| -------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `typeOfIncome` | `string` | Required. One of: `casualWork`, `partTime`, `contractWork`, `pension`, `capitalIncome`, `socialInsurance` |

### `registerCasualWork[]`

| Field             | Type                                   | Validation                                    |
| ----------------- | -------------------------------------- | --------------------------------------------- |
| `company`         | `{ nationalId: string, name: string }` | Required (nationalId required, name optional) |
| `monthFrom`       | `string`                               | Required                                      |
| `monthTo`         | `string`                               | Required                                      |
| `estimatedIncome` | `string`                               | Required                                      |

### `registerPartTime[]`

| Field             | Type                                   | Validation                                    |
| ----------------- | -------------------------------------- | --------------------------------------------- |
| `company`         | `{ nationalId: string, name: string }` | Required (nationalId required, name optional) |
| `jobStart`        | `string`                               | Required                                      |
| `workPercentage`  | `string`                               | Required                                      |
| `estimatedIncome` | `string`                               | Required                                      |

### `registerContractWork[]`

| Field              | Type     | Validation |
| ------------------ | -------- | ---------- |
| `contractJobStart` | `string` | Required   |
| `workEnds`         | `string` | Required   |

### `registerCapitalIncome[]`

| Field              | Type     | Validation |
| ------------------ | -------- | ---------- |
| `paymentType`      | `string` | Required   |
| `amountPerMonth`   | `string` | Required   |
| `paymentFrequency` | `string` | Required   |

### `registerSocialInsurance[]`

| Field               | Type     | Validation |
| ------------------- | -------- | ---------- |
| `socialPaymentType` | `string` | Required   |
| `amountPerMonth`    | `string` | Required   |
| `paymentFrequency`  | `string` | Required   |

### `registerPension[]`

| Field            | Type     | Validation                                                          |
| ---------------- | -------- | ------------------------------------------------------------------- |
| `pensionFund`    | `string` | Required. Selected from pension funds fetched from Vinnumálastofnun |
| `pensionType`    | `string` | Required                                                            |
| `amountPerMonth` | `string` | Required                                                            |

## Running unit tests

Run `nx test confirm-job-or-income` to execute the unit tests via [Jest](https://jestjs.io).
