# Defender Skjalaskrá Filtering by Police Case Number

**Date:** 2026-04-27
**Status:** Approved
**Scope:** Backend only — judicial-system backend

## Problem

In multi-defendant indictment cases, a single ákæra (indictment) may cover multiple defendants across different LÖKE (police case) numbers. For example, Mat and Pat rob a store together (one LÖKE number), but Mat also robbed a kiosk (separate LÖKE number) and Pat had an illegal weapon (another LÖKE number).

Currently, a defender (verjandi) can see the skjalaskrá (case file record PDF) for **all** LÖKE numbers in the case, including those belonging to defendants they do not represent. Pat's lawyer should not see Mat's separate robbery files and vice versa.

## Scope

**In scope:**
- Skjalaskrá PDF access filtering (per-policeCaseNumber PDFs)
- Both individual PDF requests and the all-files zip download

**Out of scope (for now):**
- Filtering of uploaded `CaseFile` entries by policeCaseNumber
- Frontend UI changes (the UI naturally adapts because we filter the data)

## Data Model (existing)

The data model already supports this feature:

- **`CaseFile.policeCaseNumber`** — each file is tagged with a LÖKE number
- **`Defendant.policeCaseNumbers`** — virtual field derived from `case_defendant_police_case_number` junction table
- **`Defendant.defenderNationalId`** + **`isDefenderChoiceConfirmed`** — links a defender to a defendant
- **`Case.policeCaseNumbers`** — virtual field, union of all LÖKE numbers across all defendants

No schema changes are required.

## Design

### Core Utility Function

A pure function that computes which LÖKE numbers a specific defender is allowed to see:

```typescript
function getDefenderVisiblePoliceCaseNumbers(
  userNationalId: string,
  defendants: Defendant[],
  allPoliceCaseNumbers: string[],
): string[]
```

**Logic:**
1. Find all defendants where `defenderNationalId === userNationalId` and `isDefenderChoiceConfirmed === true`
2. Collect the union of those defendants' `policeCaseNumbers` → **assigned-to-me**
3. Collect all `policeCaseNumbers` assigned to *any* defendant → **all-assigned**
4. Compute **unassigned** = `allPoliceCaseNumbers` minus **all-assigned**
5. Return **assigned-to-me** ∪ **unassigned**

**Safety rule:** Unassigned LÖKE numbers (not linked to any defendant) are visible to all defenders. This preserves backward compatibility with legacy cases where no defendant-to-policeCaseNumber links exist.

**Location:** `apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.ts` — alongside the existing `canLimitedAccessUserViewCaseFile` and related defender file-access utilities.

### Touch Point 1: Limited-Access Case Response

**Where:** New interceptor or extension of `LimitedAccessCaseFileInterceptor`

**What:** After the case is loaded for a limited-access user (defender), filter `case.policeCaseNumbers` using `getDefenderVisiblePoliceCaseNumbers`. The frontend generates skjalaskrá buttons from `workingCase.policeCaseNumbers`, so filtering this field means fewer buttons are rendered — zero frontend code changes needed.

**Condition:** Only apply when the user role is `DEFENDER` and the case is an indictment case.

### Touch Point 2: `getCaseFilesRecordPdf` (Defense-in-Depth)

**Where:** `limitedAccessCase.controller.ts`, method `getCaseFilesRecordPdf`

**What:** After the existing `theCase.policeCaseNumbers.includes(policeCaseNumber)` validation, add a second check: is this `policeCaseNumber` in the defender's visible set? If not, throw `ForbiddenException`.

**Why:** The interceptor should prevent this request from ever being made (the button won't render), but server-side enforcement ensures security even if the API is called directly.

### Touch Point 3: `getAllFilesZip`

**Where:** `limitedAccessCase.service.ts`, method `getAllFilesZip`

**What:** Before the `theCase.policeCaseNumbers.forEach(...)` loop that adds skjalaskrá PDFs, filter the list through `getDefenderVisiblePoliceCaseNumbers`. Only allowed LÖKE numbers get a PDF in the zip.

### Merged Cases

The merged case flow swaps `request.case` to the child case via `MergedCaseExistsGuard`. The child case has its own defendants and policeCaseNumbers. The utility function operates on whatever case data it receives, so merged cases work without special handling.

### What Stays Unchanged

- `defenderGeneratedPdfRule` guard — no changes, it already gates on confirmed defender status
- Frontend code — zero changes
- Non-limited-access (full access) users — unaffected
- Other file categories and uploaded CaseFile access — unaffected

## Testing

### Unit Tests (utility function)

| Scenario | Expected |
|----------|----------|
| Legacy case: no defendants have policeCaseNumbers | All LÖKE numbers visible |
| Single defendant, single defender | That defendant's LÖKE numbers + unassigned |
| Two defendants, two defenders | Each sees own + unassigned |
| Defender represents multiple defendants | Union of their LÖKE numbers + unassigned |
| Mixed assigned/unassigned | Unassigned visible to all |
| Empty defendants array | All visible |
| Defender not found in defendants | Only unassigned |

### Integration Tests

- Existing `getCaseFilesRecordPdf` tests continue to pass
- New: defender requesting a policeCaseNumber assigned to another defendant's defender → 403
- New: zip download only contains skjalaskrá for allowed LÖKE numbers

## Rollback Plan

The utility function is the single control point. Returning `allPoliceCaseNumbers` unfiltered disables the feature entirely with a one-line change.
