# Remaining Work: Police Case Units Migration

## Goal

Fully replace old `malseinings`-related behavior from the legacy police case info flow with the new dedicated case units endpoint flow.

## Status Snapshot

- Done:
  - Typed `getCaseUnitsFromPolice` response (`nationalId`, `caseUnits`)
  - API-layer mapping to `PoliceCaseInfo[]`
  - Subtype derivation added to new flow (old-style logic)
  - Partial-failure handling added via `Promise.allSettled` (successful national IDs are returned)
- Not done:
  - Full consumer migration and cleanup of old `malseinings` usage
  - Finalize/document partial-failure API contract per national ID
  - Final GraphQL/codegen contract alignment for web generation

## Remaining Checklist

- [ ] Validate and document per-SSN partial-failure API behavior
  - Current: `Promise.allSettled` returns successful `nationalId` results and skips failed ones
  - Decide whether response should also include structured per-SSN errors

- [ ] Add tests for new subtype derivation path
  - Unit tests for article -> offense type -> indictment subtype key mapping
  - Regression tests for duplicate subtype handling and latest-date overwrite behavior

- [ ] Add parity tests for new case-units mapping output
  - Validate `policeCaseNumber`, `place`, `date`, `licencePlate`, `subtypes`
  - Cover null/missing fields from police payload

- [ ] Verify all remaining reads of old `malseinings` payload and remove/migrate them
  - Audit backend/API/web references to old police case info composition path
  - Migrate any remaining consumers that still depend on old `malseinings`

- [ ] Confirm final scope decision on case numbers
  - Current decision: rely only on case units for case numbers in this new flow
  - Ensure no hidden dependency remains on file/digital-file case number enrichment

- [ ] Verify GraphQL schema/codegen after removing standalone `policeCaseUnits` query path
  - Ensure only `policeCaseInfo` path remains for client case-unit consumption
  - Re-run web GraphQL codegen successfully
  - Update generated artifacts if needed

- [ ] Final migration cleanup
  - Remove dead code paths tied only to old `malseinings`-based logic (when safe)
  - Keep legacy path only if still needed by non-migrated consumers
  - Document final source-of-truth for case units in module docs/comments

## Suggested Execution Order

1. Finalize and document partial-failure API contract
2. Tests for subtype/parity mapping
3. Consumer audit and migration off old `malseinings` usage
4. GraphQL/codegen alignment and regeneration
5. Legacy cleanup
