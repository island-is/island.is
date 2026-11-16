# Application Templates Financial Aid

This library was generated with [Nx](https://nx.dev).

## Backend routing

The municipality provider selects `municipalities` (the primary backend) or
`veita` using `SI_PUBLIC_FINANCIAL_AID_VEITA_TENANTS` on its first successful
fetch. It persists `backend` and, for Veita, `veitaTenant` in
`externalData.municipality.data`. Subsequent municipality fetches reuse the
successful settings snapshot so a failed refetch cannot erase the pinned route.
Applicant tax data runs after municipality data; spouse tax data,
uploads, submission, and both status screens use the same stored route.

Applications without `backend` use `municipalities`, including applications
created before routing was persisted. Configuration changes only affect new
routing decisions; they do not migrate existing applications or attachments.
Keep the selected backend and Veita tenant available for existing applications.

## Running unit tests

Run `nx test application-templates-financial-aid` to execute the unit tests via [Jest](https://jestjs.io).
