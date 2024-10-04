# Parental Leave Application Template

## Description

This template allows applicants to apply for parental leave and ensures all steps for parents and employers are completed. It communicates with external APIs to validate applicants and submits applications to Vinnumálastofnun.

### Glossary

| Term             | Description                   |
| ---------------- | ----------------------------- |
| Primary parent   | The mother carrying the child |
| Secondary parent | The other parent              |
| VMST             | Vinnumálastofnun              |

### States

#### Prerequisites

A temporary, unlisted state for new applications. An external data step checks if the applicant is expecting a child. If not, they must specify if they are applying due to adoption, foster care, or as a father-without-mother.

#### Draft

Valid applicants proceed here to fill in relevant application data.

#### Other Parent Approval

Secondary parent approval is needed if the primary parent requests a transfer of rights. The secondary parent receives an email to approve the request.

#### Other Parent Requires Action

If the secondary parent requests edits instead of approving the transfer, the primary parent must update the application.

#### Employer Waiting to Assign

Applicants provide employer email addresses for confirmation. Employers approve one at a time. This step repeats if multiple employers are listed.

#### Employer Approval

Employers review selected periods, pension fund, and union information, and either approve or request changes.

#### Employer Requires Action

Employers may request applicant edits, requiring the applicant to update their application.

#### VMST Approval

Applications sent to VMST for approval.

#### VMST Requires Action

VMST may request changes; applicants must update their application.

#### Edit or Add Periods

Applicants can change or add periods/employers. Document upload is needed if changing a previous employer.

#### Additional States

- **Residence Grant No Birthdate:** Can't apply if no birthdate given.
- **Residence Grant:** Application eligible if under 6 months postpartum.
- **Employer Approval Edits:** Employers review and approve edits.
- **Employer Requires Action on Edits:** Employers request edits.
- **VMST Approve Edits:** Edited applications sent to VMST.
- **VMST Requires Action on Edits:** VMST requests changes.
- **Additional Document Required:** VMST requests extra documents.
- **Approve:** Applications approved by VMST.
- **Close:** Rights expired or leave time finished.

### API Integration

User interactions occur through a GraphQL API integrated with others. To communicate with VMST, requests must go through X-Road. Local proxy for VMST testing requires setup.

### Localization

Translations available on Contentful:

- [Parental Leave Application](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/pl.application)
- [Application System](https://app.contentful.com/spaces/8k0h54kbe6bj/entries/application.system)

### Emails

Emails are sent to applicants and assignees. Templates are stored in the API module. Local development shows previews of email templates.

## Setup

Refer to [application-system](../../../../apps/application-system/README.md) for setup instructions. Run:

- `application-system-api`
  - Use: `yarn get-secrets application-system-api`
- `api`
  - Use: `yarn get-secrets api`
- `application-system-form`

Access at [http://localhost:4200/umsoknir/faedingarorlof](http://localhost:4200/umsoknir/faedingarorlof).

### Local Database

A local PostgreSQL database is created via Docker. Tools like pgAdmin can be used for database interaction.

## Error Investigation

Use `Datadog` for backend and `Sentry` for client error logging.

## Future Work

- Screens for users who are no longer assignees.
- Localisation in emails.
- Allow secondary parent to request personal allowance.
