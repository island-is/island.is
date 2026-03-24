# Police Case Units Design

## Context

We are introducing a new case-units endpoint (`GetRVMalseiningar`) that returns all case units linked to each defendant.

Current behavior in the old `getPoliceCaseInfo` flow derives case info by combining multiple sources (case units + file endpoints). For the new path, we can trust the dedicated case-units endpoint as the source of truth and avoid extra inference from file fetching.

The goal is to keep `backend` police service focused on fetching/validation, and move domain shaping into the `api` layer, with one typed web hook for consumers.

## Goals

- Strongly type case-units flow end-to-end (backend -> api -> web)
- Keep old `getPoliceCaseInfo` implementation untouched
- Avoid domain mapping in `backend` police service
- Provide one client hook to fetch/use case units

## Non-Goals

- Replacing old `policeCaseInfo` query yet
- Refactoring unrelated police/file modules
- Broad UI migration beyond the initial hook usage

## Chosen Approach (Option A)

Transform data in the `api` layer.

1. `backend` police service fetches and validates raw case-units payload and returns typed data.
2. `api` layer maps raw case units into domain-friendly output shape.
3. `web` consumes a single typed hook backed by typed GraphQL.

This keeps concerns separated:

- `backend`: integration and parsing
- `api`: domain transformation and GraphQL contract
- `web`: consumption only

## Data Contracts

### Backend return type

`getCaseUnitsFromPolice` returns:

- `Array<{ nationalId: string; caseUnits: CaseUnit[] }>`

Where `CaseUnit` corresponds to the schema currently used for `GetRVMalseiningar` items.

### API backend client contract

`BackendService.getPoliceCaseUnits` mirrors the same typed return.

### GraphQL contract

Replace debug JSON response with typed objects:

- `PoliceCaseUnitsByDefendant { nationalId: String!, caseUnits: [PoliceCaseUnit!]! }`
- `PoliceCaseUnit { ...typed fields from endpoint... }`

In addition, expose a derived typed query for mapped case info from case units.

## Mapping Placement

Add a mapper in `api/src/app/modules/police/` (for example `policeCaseUnits.mapper.ts`):

- Input: `Array<{ nationalId: string; caseUnits: CaseUnit[] }>`
- Output: `PoliceCaseInfo[]`-compatible structure used by indictment flows

The resolver should call:

1. `backendService.getPoliceCaseUnits(...)`
2. mapper function
3. return typed mapped response

No business mapping is added to `backend/src/app/modules/police/police.service.ts`.

## Web Hook Design

Promote `usePoliceCaseUnits` from debug to production:

- Inputs: `caseId`, `nationalIds`, optional `enabled`
- Output: typed mapped data (`PoliceCaseInfo[]`-style), `loading`, `error`, `refetch`
- Behavior: skip query when missing required input

The hook remains the single entrypoint for client-side case-units fetching.

## Error Handling

- Preserve existing backend exception semantics (`NotFound`, `BadGateway`)
- Mapper handles empty/null optional fields safely
- Sorting/grouping should be deterministic
- Hook should not block unrelated UI behavior when enrichment fails

## Testing Plan

### Backend

- Unit tests for typed parsing of `GetRVMalseiningar` payload

### API

- Mapper tests for grouping, date selection, place formatting, subtype mapping parity
- Resolver tests for typed GraphQL output

### Web

- Hook tests for skip/enabled behavior and typed response handling

## Rollout Notes

- Keep old `policeCaseInfo` path untouched during initial rollout
- Introduce new typed query/hook path in parallel
- Migrate consumers incrementally once validated
