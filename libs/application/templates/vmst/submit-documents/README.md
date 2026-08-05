# Submit Documents (Skila gögnum)

## About

This application allows users with an active case at **Vinnumálastofnun** (Directorate of Labour) to submit supplementary documents. Users select a document type from a list fetched from Vinnumálastofnun, upload files, and add a comment for each entry. Up to 10 document entries can be submitted at once.

**Organization:** Vinnumálastofnun
**Code owner:** Origo

## Gervimenn

Anna Mary ÞÍ Ívarsdóttir - 2011651489, phone: 201-1489
Note: Gervimenn must have an active application registered at Vinnumálastofnun to pass the eligibility check.

## State flow

```
PREREQUISITES ──(SUBMIT)──▶ DRAFT ──(SUBMIT)──▶ COMPLETED
```

| State             | Description                                                                                                       | API action                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **PREREQUISITES** | Checks eligibility via Vinnumálastofnun and fetches available attachment types. User must approve data gathering. | `checkEligibility`, `getAttachmentTypes` (on entry) |
| **DRAFT**         | User uploads documents using a table repeater. Each row has a document type, file upload, and comment.            | `completeApplication` (on exit)                     |
| **COMPLETED**     | Read-only confirmation screen. Documents are now accessible on My Pages.                                          | —                                                   |

- Applications can be deleted in PREREQUISITES and DRAFT states.
- Draft applications are pruned after 2 days, completed after 30 days.
- Only the applicant can access their own application.

## Data schema

| Field                 | Type                                     | Validation                                                                                    |
| --------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `approveExternalData` | `boolean`                                | Must be `true`                                                                                |
| `documents`           | `array of { type, file, comment }`       | Min 1, max 10 entries                                                                         |
| `documents[].type`    | `string`                                 | Required, selected from attachment types fetched from Vinnumálastofnun                        |
| `documents[].file`    | `array of { key: string, name: string }` | 1 file per entry. Accepted: `.pdf`, `.docx`, `.rtf`, `.doc`, `.jpg`, `.jpeg`, `.png`, `.heic` |
| `documents[].comment` | `string`                                 | Required, min length 1 (i.e required)                                                         |

## Running unit tests

Run `nx test submit-documents` to execute the unit tests via [Jest](https://jestjs.io).
