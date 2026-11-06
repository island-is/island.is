# Icelandic Government Institutions API domain

GraphQL queries for open invoice payments from the FJS Elfur API. The domain uses the [government invoices client](../../../clients/government-invoices/README.md) for authentication and upstream requests.

## Queries

- `icelandicGovernmentInstitutionsInvoicePaymentsGroups`: paginated payment groups with date, supplier, debtor, ministry, and payment type filters.
- `icelandicGovernmentInstitutionsInvoicePaymentsGroup`: one payment group with its invoices and itemization.
- Lookup queries for suppliers, debtors, ministries, payment types, and payment type groups.

The public [Open Invoices page](../../../../apps/web/screens/OpenInvoices/Overview/Overview.tsx) uses these queries. The required `ELFUR_*` settings are documented in the client README.

## Tests

Run `yarn nx test api-domains-icelandic-government-institutions`.
