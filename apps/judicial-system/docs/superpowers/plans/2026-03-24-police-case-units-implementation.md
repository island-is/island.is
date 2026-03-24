# Police Case Units Typed Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a typed end-to-end case-units flow that keeps backend police service as fetch/parse only, moves mapping into the API layer, and exposes one typed web hook for consumers.

**Architecture:** Backend returns typed raw case-units per defendant national ID from `GetRVMalseiningar` as a direct array of `{ nationalId, caseUnits }`. API introduces typed GraphQL models plus a mapper that derives the consumer shape from raw units. Web uses a single typed hook that queries the new typed API contract and removes debug-only JSON behavior.

**Tech Stack:** NestJS, GraphQL (code-first), TypeScript, Apollo Client, existing judicial-system module patterns, Jest tests.

---

## Planned File Structure

- **Backend fetch and contract**
  - Modify: `backend/src/app/modules/police/police.service.ts`
  - Modify: `backend/src/app/modules/police/police.controller.ts`
- **API transport + mapping**
  - Modify: `api/src/app/modules/backend/backend.service.ts`
  - Modify: `api/src/app/modules/police/police.resolver.ts`
  - Create: `api/src/app/modules/police/models/policeCaseUnit.model.ts`
  - Create: `api/src/app/modules/police/models/policeCaseUnitsByDefendant.model.ts`
  - Create: `api/src/app/modules/police/policeCaseUnits.mapper.ts`
  - Modify: `api/src/app/modules/police/index.ts` (if needed for exports)
- **Web hook and query**
  - Modify: `web/src/utils/hooks/usePoliceDefendants/policeCaseUnits.graphql`
  - Regenerate: `web/src/utils/hooks/usePoliceDefendants/policeCaseUnits.generated.ts`
  - Modify: `web/src/utils/hooks/usePoliceDefendants/usePoliceCaseUnits.ts`
  - Modify: `web/src/routes/Prosecutor/Indictments/Defendant/DefendantList/DefendantList.tsx`
- **Tests**
  - Create/Modify: `api/src/app/modules/police/test/*` (mapper + resolver tests)
  - Modify: backend police tests if return contract assertions require updates

### Task 1: Type Backend Case Units Return (Contract First)

**Files:**
- Modify: `backend/src/app/modules/police/police.service.ts`
- Modify: `backend/src/app/modules/police/police.controller.ts`
- Test: `backend/src/app/modules/police/test/getAll.spec.ts` and/or relevant police service spec

- [ ] **Step 1: Write failing backend test expectation for typed shape**
  - Update or add a spec assertion that `getCaseUnitsFromPolice` returns:
    - `[{ nationalId: string, caseUnits: CaseUnit[] }]`
  - Explicitly enforce key renames:
    - key remains `nationalId` for consistency
    - `units -> caseUnits`
  - Remove `results` wrapper from expectations.

- [ ] **Step 2: Run backend police tests to verify failure**
  - Run: `pnpm --filter judicial-system-backend test -- police`
  - Expected: failing assertion around previous `nationalId` / `units` contract.

- [ ] **Step 3: Implement minimal backend typing and key mapping**
  - In `police.service.ts`:
    - Introduce explicit `CaseUnit` and `CaseUnitsByDefendant` TypeScript types near schema definitions.
    - Change `fetchCaseUnitsForNationalId` return to `{ nationalId, caseUnits }`.
    - Change `getCaseUnitsFromPolice` return type to `CaseUnitsByDefendant[]` (no wrapper object).
    - Keep zod parsing as-is, only rename/shape output.
  - In `police.controller.ts`:
    - Update method return type for `getPoliceCaseUnits` accordingly.

- [ ] **Step 4: Add backend contract checkpoint**
  - Verify controller signature and response serialization match exactly `CaseUnitsByDefendant[]`.
  - Ensure no references to `nationalId`, `units`, or `results` remain in new path.

- [ ] **Step 5: Re-run backend tests**
  - Run: `pnpm --filter judicial-system-backend test -- police`
  - Expected: PASS for changed tests.

- [ ] **Step 6: Optional checkpoint commit**
  - `git add backend/src/app/modules/police/police.service.ts backend/src/app/modules/police/police.controller.ts backend/src/app/modules/police/test/*`
  - `git commit -m "refactor(judicial-system): type backend police case-units response"`

### Task 2: Add Typed API Models and Backend Client Contract

**Files:**
- Modify: `api/src/app/modules/backend/backend.service.ts`
- Create: `api/src/app/modules/police/models/policeCaseUnit.model.ts`
- Create: `api/src/app/modules/police/models/policeCaseUnitsByDefendant.model.ts`
- Modify: `api/src/app/modules/police/index.ts` (if model exports are used)
- Test: `api/src/app/modules/police/test/*` (or existing resolver model tests)

- [ ] **Step 1: Write failing API resolver/model test for typed GraphQL output**
  - Add a test expectation that `policeCaseUnits` resolves typed fields (`nationalId`, `caseUnits`) rather than generic JSON.

- [ ] **Step 2: Run API police tests to confirm failure**
  - Run: `pnpm --filter judicial-system-api test -- police`
  - Expected: failure due to missing GraphQL model or resolver type mismatch.

- [ ] **Step 3: Implement model classes and backend service typing**
  - Define GraphQL `@ObjectType()` models for:
    - `PoliceCaseUnit`
    - `PoliceCaseUnitsByDefendant`
  - Update `backend.service.ts#getPoliceCaseUnits` return type to typed array.

- [ ] **Step 4: Add API raw-contract checkpoint**
  - Verify API resolver schema for raw query is explicit typed object list:
    - `[PoliceCaseUnitsByDefendant!]!`
  - Ensure no `GraphQLJSONObject` remains for `policeCaseUnits`.

- [ ] **Step 5: Re-run API tests**
  - Run: `pnpm --filter judicial-system-api test -- police`
  - Expected: model/type contract tests pass.

- [ ] **Step 6: Optional checkpoint commit**
  - `git add api/src/app/modules/backend/backend.service.ts api/src/app/modules/police/models/*.ts api/src/app/modules/police/index.ts api/src/app/modules/police/test/*`
  - `git commit -m "feat(judicial-system-api): add typed police case-units models"`

### Task 3: Implement API Mapper and Derived Resolver Path

**Files:**
- Create: `api/src/app/modules/police/policeCaseUnits.mapper.ts`
- Modify: `api/src/app/modules/police/police.resolver.ts`
- Test: `api/src/app/modules/police/test/policeCaseUnits.mapper.spec.ts`
- Test: `api/src/app/modules/police/test/police.resolver.spec.ts` (or equivalent)

- [ ] **Step 1: Write failing mapper tests for transformation behavior**
  - Cover:
    - grouping by police case number
    - deterministic subtype aggregation
    - date selection behavior
    - place formatting parity with old behavior

- [ ] **Step 2: Run mapper/resolver tests to verify failure**
  - Run: `pnpm --filter judicial-system-api test -- policeCaseUnits`
  - Expected: missing mapper or failing expected output.

- [ ] **Step 3: Implement minimal mapper and resolver wiring**
  - Add pure mapper function in `policeCaseUnits.mapper.ts`.
  - In resolver:
    - Keep `policeCaseUnits` as typed raw response (`[{ nationalId, caseUnits }]`).
    - Add a new explicit derived query (for example `policeCaseInfoFromCaseUnits`) that:
      1) fetches raw case units via backend service,
      2) maps in API layer,
      3) returns typed `PoliceCaseInfo[]`.
    - Do not modify old `policeCaseInfo` behavior.

- [ ] **Step 4: Add API derived-contract checkpoint**
  - Verify derived query exists and returns typed `PoliceCaseInfo[]` contract.
  - Verify raw and derived queries are both covered by resolver tests.

- [ ] **Step 5: Re-run API tests**
  - Run: `pnpm --filter judicial-system-api test -- police`
  - Expected: PASS for mapper/resolver tests.

- [ ] **Step 6: Optional checkpoint commit**
  - `git add api/src/app/modules/police/policeCaseUnits.mapper.ts api/src/app/modules/police/police.resolver.ts api/src/app/modules/police/test/*`
  - `git commit -m "feat(judicial-system-api): map police case units in resolver layer"`

### Task 4: Update Web GraphQL Query and Single Hook

**Files:**
- Modify: `web/src/utils/hooks/usePoliceDefendants/policeCaseUnits.graphql`
- Regenerate: `web/src/utils/hooks/usePoliceDefendants/policeCaseUnits.generated.ts`
- Modify: `web/src/utils/hooks/usePoliceDefendants/usePoliceCaseUnits.ts`
- Modify: `web/src/routes/Prosecutor/Indictments/Defendant/DefendantList/DefendantList.tsx`
- Test: existing hook/component tests if present under `web/src/utils/hooks` or route tests

- [ ] **Step 1: Write failing hook usage test (or type-level compile expectation)**
  - Assert hook returns typed data contract and no `unknown`/JSON payload usage.

- [ ] **Step 2: Run web tests/typecheck to verify failure**
  - Run: `pnpm --filter judicial-system-web test -- usePoliceCaseUnits`
  - Run: `pnpm --filter judicial-system-web typecheck`
  - Expected: failure due to old debug query shape.

- [ ] **Step 3: Implement typed query + hook**
  - Update `policeCaseUnits.graphql` to query the derived typed query (`PoliceCaseInfo[]`-style output) used by UI consumers.
  - Keep raw typed query available for debugging/internal use only if needed.
  - Regenerate GraphQL artifacts.
  - Rewrite hook to return typed data, loading, error, refetch.
  - Remove debug console logging.
  - Keep it as the single entrypoint used by `DefendantList`.

- [ ] **Step 4: Add web hook-contract checkpoint**
  - Verify hook return type is explicit and consumer-safe (no `unknown`/JSON).
  - Verify `DefendantList` uses this hook only for case-units fetch path.

- [ ] **Step 5: Re-run web tests/typecheck**
  - Run: `pnpm --filter judicial-system-web test -- usePoliceCaseUnits`
  - Run: `pnpm --filter judicial-system-web typecheck`
  - Expected: PASS.

- [ ] **Step 6: Optional checkpoint commit**
  - `git add web/src/utils/hooks/usePoliceDefendants/* web/src/routes/Prosecutor/Indictments/Defendant/DefendantList/DefendantList.tsx`
  - `git commit -m "refactor(judicial-system-web): use typed police case-units hook"`

### Task 5: End-to-End Verification and Cleanup

**Files:**
- Modify: any touched files for lint/test fixes only
- Test: full targeted backend/api/web verification

- [ ] **Step 1: Run lint/type checks for touched projects**
  - Run: `pnpm --filter judicial-system-backend lint`
  - Run: `pnpm --filter judicial-system-api lint`
  - Run: `pnpm --filter judicial-system-web lint`

- [ ] **Step 2: Run focused test suites**
  - Run: `pnpm --filter judicial-system-backend test -- police`
  - Run: `pnpm --filter judicial-system-api test -- police`
  - Run: `pnpm --filter judicial-system-web test -- policeCaseUnits`

- [ ] **Step 3: Manual smoke-check key UI path**
  - Validate defendant list flow still triggers case-units fetch without runtime errors.
  - Confirm hook returns typed data and existing UI remains stable.

- [ ] **Step 4: Final status check**
  - Run: `git status`
  - Ensure only expected files changed.

- [ ] **Step 5: Optional final fixup commit**
  - `git add <fixup-files>`
  - `git commit -m "chore(judicial-system): finalize typed police case-units flow"`

