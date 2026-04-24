# Confirm Job Search (Staðfesta atvinnuleit)

## About

This application allows unemployed individuals to periodically confirm their active job search status with **Vinnumálastofnun** (Directorate of Labour). Users enter the companies they've applied to during a monthly confirmation window (20th–25th of each month).

**Organization:** Vinnumálastofnun  
**Code owner:** Origo

## Gervimenn

Thelma Hrönn ÞÍ Sveinsdóttir - 010455-1469
Note: Gervimenn must have active unemployment benefits registered in VMST. Applications can only be submitted between the 20th and 25th of each month, with a grace period extending to the 4th of the following month.

## State flow

```
PREREQUISITES ──(SUBMIT)──▶ DRAFT ──(SUBMIT)──▶ COMPLETED
```

| State             | Description                                                                                   | API action                      |
| ----------------- | --------------------------------------------------------------------------------------------- | ------------------------------- |
| **PREREQUISITES** | Fetches eligibility data from Vinnumálastofnun. User must approve data gathering.             | `checkEligibility` (on entry)   |
| **DRAFT**         | User enters companies they have applied to via a table repeater. At least one entry required. | `completeApplication` (on exit) |
| **COMPLETED**     | Read-only confirmation screen showing the next confirmation period (20th–25th).               | —                               |

- Applications can be deleted in PREREQUISITES and DRAFT states.
- Only one application in draft is allowed at a time.
- Only the applicant can access their own application.

## Data schema

| Field                 | Type                               | Validation                                 |
| --------------------- | ---------------------------------- | ------------------------------------------ |
| `approveExternalData` | `boolean`                          | Must be `true`                             |
| `jobSearchItems`      | `array of { companyName: string }` | Non-empty, each `companyName` min length 1 |

## Running unit tests

Run `nx test confirm-job-search` to execute the unit tests via [Jest](https://jestjs.io).
