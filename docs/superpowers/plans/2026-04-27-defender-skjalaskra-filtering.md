# Defender Skjalaskrá Filtering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Filter skjalaskrá (case file record) PDFs so defenders only see those tied to their defendant's LÖKE numbers (plus unassigned ones for backward compatibility).

**Architecture:** A pure utility function `getDefenderVisiblePoliceCaseNumbers` computes the allowed set. It is applied in three places: an interceptor that filters `case.policeCaseNumbers` on the response, a defense-in-depth check in the PDF controller, and the zip download service. No schema changes. No frontend changes.

**Tech Stack:** NestJS (TypeScript), Sequelize, Jest

---

### Task 1: Create the `getDefenderVisiblePoliceCaseNumbers` utility function with tests

**Files:**
- Modify: `apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.ts`
- Create: `apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.spec.ts`

- [ ] **Step 1: Write the unit tests**

Create `apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.spec.ts`:

```typescript
import { getDefenderVisiblePoliceCaseNumbers } from './caseFileCategory'

import { Defendant } from '../../repository'

const makeDefendant = (
  overrides: Partial<{
    defenderNationalId: string
    isDefenderChoiceConfirmed: boolean
    policeCaseNumbers: string[]
  }> = {},
): Defendant =>
  ({
    defenderNationalId: overrides.defenderNationalId ?? null,
    isDefenderChoiceConfirmed:
      overrides.isDefenderChoiceConfirmed ?? false,
    policeCaseNumbers: overrides.policeCaseNumbers ?? [],
  }) as unknown as Defendant

describe('getDefenderVisiblePoliceCaseNumbers', () => {
  it('should return all police case numbers when no defendants have police case numbers (legacy case)', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: [],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: [],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    expect(result.sort()).toEqual(allNumbers.sort())
  })

  it('should return all police case numbers when defendants array is empty', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      [],
      allNumbers,
    )

    expect(result.sort()).toEqual(allNumbers.sort())
  })

  it('should return all police case numbers when defendants is undefined', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      undefined as unknown as Defendant[],
      allNumbers,
    )

    expect(result.sort()).toEqual(allNumbers.sort())
  })

  it('should return only own defendant police case numbers plus unassigned', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    // 007-2026-1 (own) + 007-2026-3 (unassigned)
    expect(result.sort()).toEqual(['007-2026-1', '007-2026-3'].sort())
  })

  it('should return union when defender represents multiple defendants', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-3'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    expect(result.sort()).toEqual(['007-2026-1', '007-2026-2'].sort())
  })

  it('should return only unassigned when defender is not found in defendants', () => {
    const allNumbers = ['007-2026-1', '007-2026-2', '007-2026-3']
    const defendants = [
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1', '007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    // Only 007-2026-3 is unassigned
    expect(result.sort()).toEqual(['007-2026-3'].sort())
  })

  it('should treat unconfirmed defender choice as not being a defender', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: false,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    // Both numbers are assigned to defendants. The user's defendant has
    // unconfirmed defender choice, so the user is not recognized as a
    // defender of anyone. assignedToMe is empty, and there are no
    // unassigned numbers, so the result is empty.
    expect(result).toEqual([])
  })

  it('should handle shared LÖKE number between defendants', () => {
    const allNumbers = ['007-2026-1', '007-2026-2']
    const defendants = [
      makeDefendant({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1'],
      }),
      makeDefendant({
        defenderNationalId: '0987654321',
        isDefenderChoiceConfirmed: true,
        policeCaseNumbers: ['007-2026-1', '007-2026-2'],
      }),
    ]

    const result = getDefenderVisiblePoliceCaseNumbers(
      '1234567890',
      defendants,
      allNumbers,
    )

    // 007-2026-1 is assigned to user's defendant. 007-2026-2 is assigned
    // to another defendant only. No unassigned numbers.
    expect(result).toEqual(['007-2026-1'])
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.spec.ts --no-coverage`

Expected: FAIL — `getDefenderVisiblePoliceCaseNumbers` is not exported.

- [ ] **Step 3: Implement the utility function**

Add the following to `apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.ts` at the end of the file (before the closing of the module, after `getDefenceUserCaseFileCategories`):

```typescript
export const getDefenderVisiblePoliceCaseNumbers = (
  userNationalId: string,
  defendants: Defendant[] | undefined,
  allPoliceCaseNumbers: string[],
): string[] => {
  const allAssigned = new Set(
    (defendants ?? []).flatMap((d) => d.policeCaseNumbers ?? []),
  )

  if (allAssigned.size === 0) {
    return allPoliceCaseNumbers
  }

  const myDefendants = (defendants ?? []).filter(
    (d) =>
      d.isDefenderChoiceConfirmed &&
      d.defenderNationalId &&
      normalizeAndFormatNationalId(userNationalId).includes(
        d.defenderNationalId,
      ),
  )

  const assignedToMe = new Set(
    myDefendants.flatMap((d) => d.policeCaseNumbers ?? []),
  )

  return allPoliceCaseNumbers.filter(
    (pcn) => assignedToMe.has(pcn) || !allAssigned.has(pcn),
  )
}
```

- [ ] **Step 4: Export from the file module index**

In `apps/judicial-system/backend/src/app/modules/file/index.ts`, add `getDefenderVisiblePoliceCaseNumbers` to the existing export from `'./guards/caseFileCategory'`. The current line is:

```typescript
export {
  canLimitedAccessUserViewCaseFile,
  getDefenceUserCaseFileCategories,
  getDefenceUserCutoffDate,
} from './guards/caseFileCategory'
```

Change it to:

```typescript
export {
  canLimitedAccessUserViewCaseFile,
  getDefenceUserCaseFileCategories,
  getDefenceUserCutoffDate,
  getDefenderVisiblePoliceCaseNumbers,
} from './guards/caseFileCategory'
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx jest apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.spec.ts --no-coverage`

Expected: All 8 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.ts \
       apps/judicial-system/backend/src/app/modules/file/guards/caseFileCategory.spec.ts \
       apps/judicial-system/backend/src/app/modules/file/index.ts
git commit -m "feat(j-s): add getDefenderVisiblePoliceCaseNumbers utility with tests"
```

---

### Task 2: Filter `policeCaseNumbers` on the limited-access case response

**Files:**
- Modify: `apps/judicial-system/backend/src/app/modules/case/interceptors/limitedAccessCaseFile.interceptor.ts`

- [ ] **Step 1: Write the failing test scenario**

The interceptor is already tested indirectly via the controller tests. We will verify the new behavior in Task 5 (integration tests). For now, we modify the interceptor.

- [ ] **Step 2: Add the filtering to the interceptor**

Modify `apps/judicial-system/backend/src/app/modules/case/interceptors/limitedAccessCaseFile.interceptor.ts`. The current interceptor filters `caseFiles`. We add filtering of `policeCaseNumbers` in the same `map` operator.

The full updated file should be:

```typescript
import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  isDefenceUser,
  isIndictmentCase,
  User,
} from '@island.is/judicial-system/types'

import {
  canLimitedAccessUserViewCaseFile,
  getDefenderVisiblePoliceCaseNumbers,
} from '../../file'

@Injectable()
export class LimitedAccessCaseFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser

    return next.handle().pipe(
      map((theCase) => {
        const caseFiles = theCase.caseFiles?.filter(
          ({
            category,
            submittedBy,
            fileRepresentative,
            defendantId,
          }: {
            category: CaseFileCategory
            submittedBy: string
            fileRepresentative: string
            defendantId?: string
          }) =>
            canLimitedAccessUserViewCaseFile({
              user,
              caseType: theCase.type,
              caseState: theCase.state,
              submittedBy,
              fileRepresentative,
              caseFileCategory: category,
              defendants: theCase.defendants,
              civilClaimants: theCase.civilClaimants,
              defendantId,
            }),
        )

        let policeCaseNumbers = theCase.policeCaseNumbers

        if (
          isDefenceUser(user) &&
          isIndictmentCase(theCase.type) &&
          theCase.policeCaseNumbers
        ) {
          policeCaseNumbers = getDefenderVisiblePoliceCaseNumbers(
            user.nationalId,
            theCase.defendants,
            theCase.policeCaseNumbers,
          )
        }

        return {
          ...theCase,
          caseFiles,
          policeCaseNumbers,
        }
      }),
    )
  }
}
```

- [ ] **Step 3: Run existing interceptor/controller tests to verify nothing broke**

Run: `npx jest apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/ --no-coverage`

Expected: All existing tests PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/judicial-system/backend/src/app/modules/case/interceptors/limitedAccessCaseFile.interceptor.ts
git commit -m "feat(j-s): filter policeCaseNumbers in limited-access case response for defenders"
```

---

### Task 3: Add defense-in-depth check to `getCaseFilesRecordPdf`

**Files:**
- Modify: `apps/judicial-system/backend/src/app/modules/case/limitedAccessCase.controller.ts`

- [ ] **Step 1: Add the user parameter and filtering check**

In `apps/judicial-system/backend/src/app/modules/case/limitedAccessCase.controller.ts`, modify the `getCaseFilesRecordPdf` method.

Current method signature (around line 215):

```typescript
  async getCaseFilesRecordPdf(
    @Param('caseId') caseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
```

Change to:

```typescript
  async getCaseFilesRecordPdf(
    @Param('caseId') caseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
```

Then, after the existing `policeCaseNumbers.includes` check (around line 225–229), add:

```typescript
    const visiblePoliceCaseNumbers = getDefenderVisiblePoliceCaseNumbers(
      user.nationalId,
      theCase.defendants,
      theCase.policeCaseNumbers,
    )

    if (!visiblePoliceCaseNumbers.includes(policeCaseNumber)) {
      throw new ForbiddenException(
        `Defender does not have access to police case number ${policeCaseNumber}`,
      )
    }
```

Also add the import for `getDefenderVisiblePoliceCaseNumbers` at the top of the file. Find the existing import from `'../file'`:

```typescript
import { FileService } from '../file'
```

And change it to:

```typescript
import { FileService, getDefenderVisiblePoliceCaseNumbers } from '../file'
```

Note: `ForbiddenException` is already imported (line 8), `CurrentHttpUser` is already imported (line 26), and `TUser` is already imported (line 32).

- [ ] **Step 2: Update the existing test to pass the user parameter**

In `apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/getCaseFilesRecordPdf.spec.ts`, the `givenWhenThen` function calls `limitedAccessCaseController.getCaseFilesRecordPdf` with 4 arguments. Add the user as the third argument.

Update the test file. Add at the top of the `describe` block (after `const theCase = ...`):

```typescript
  const user = { nationalId: '1234567890' } as TUser
```

Add the import for `TUser`:

```typescript
import type { User as TUser } from '@island.is/judicial-system/types'
```

Update the `givenWhenThen` call (around line 75):

```typescript
        await limitedAccessCaseController.getCaseFilesRecordPdf(
          caseId,
          policeCaseNumber,
          user,
          theCase,
          res,
        )
```

The existing test case for "police case number not included in case" should still pass because it uses a random UUID that isn't in `theCase.policeCaseNumbers`, so it hits the `BadRequestException` before reaching the new check.

- [ ] **Step 3: Run the tests to verify they pass**

Run: `npx jest apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/getCaseFilesRecordPdf.spec.ts --no-coverage`

Expected: All 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/judicial-system/backend/src/app/modules/case/limitedAccessCase.controller.ts \
       apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/getCaseFilesRecordPdf.spec.ts
git commit -m "feat(j-s): add defense-in-depth police case number check on skjalaskrá PDF endpoint"
```

---

### Task 4: Filter police case numbers in `getAllFilesZip`

**Files:**
- Modify: `apps/judicial-system/backend/src/app/modules/case/limitedAccessCase.service.ts`

- [ ] **Step 1: Add the filtering to the zip service**

In `apps/judicial-system/backend/src/app/modules/case/limitedAccessCase.service.ts`, add `getDefenderVisiblePoliceCaseNumbers` to the existing import from `'../file'` (around line 35–39):

```typescript
import {
  FileService,
  getDefenceUserCaseFileCategories,
  getDefenceUserCutoffDate,
  getDefenderVisiblePoliceCaseNumbers,
} from '../file'
```

In the `getAllFilesZip` method, find the line (around 840):

```typescript
      theCase.policeCaseNumbers.forEach((policeCaseNumber) => {
```

Replace with:

```typescript
      const visiblePoliceCaseNumbers = getDefenderVisiblePoliceCaseNumbers(
        user.nationalId,
        theCase.defendants,
        theCase.policeCaseNumbers,
      )

      visiblePoliceCaseNumbers.forEach((policeCaseNumber) => {
```

- [ ] **Step 2: Run existing tests to verify nothing broke**

Run: `npx jest apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/ --no-coverage`

Expected: All existing tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/judicial-system/backend/src/app/modules/case/limitedAccessCase.service.ts
git commit -m "feat(j-s): filter skjalaskrá PDFs in zip download by defender's visible police case numbers"
```

---

### Task 5: Add integration tests for the new filtering behavior

**Files:**
- Modify: `apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/getCaseFilesRecordPdf.spec.ts`

- [ ] **Step 1: Add a test for defender blocked from another defendant's police case number**

In `apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/getCaseFilesRecordPdf.spec.ts`, add a new `describe` block after the existing "police case number not included in case" block:

```typescript
  describe('defender does not have access to police case number', () => {
    const otherDefenderPoliceCaseNumber = theCase.policeCaseNumbers[0]
    let then: Then

    beforeEach(async () => {
      // Set up defendants so the requested police case number belongs to
      // another defendant with a different defender
      const caseWithDefendants = {
        ...theCase,
        defendants: [
          {
            defenderNationalId: user.nationalId,
            isDefenderChoiceConfirmed: true,
            policeCaseNumbers: [policeCaseNumber],
          },
          {
            defenderNationalId: '9999999999',
            isDefenderChoiceConfirmed: true,
            policeCaseNumbers: [otherDefenderPoliceCaseNumber],
          },
        ],
      } as Case

      const then2 = {} as Then

      try {
        await limitedAccessCaseController.getCaseFilesRecordPdf(
          caseId,
          otherDefenderPoliceCaseNumber,
          user,
          caseWithDefendants,
          res,
        )
      } catch (error) {
        then2.error = error as Error
      }

      then = then2
    })

    it('should return ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toEqual(
        `Defender does not have access to police case number ${otherDefenderPoliceCaseNumber}`,
      )
    })
  })
```

Add `ForbiddenException` to the imports:

```typescript
import { BadRequestException, ForbiddenException } from '@nestjs/common'
```

- [ ] **Step 2: Run all tests to verify they pass**

Run: `npx jest apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/getCaseFilesRecordPdf.spec.ts --no-coverage`

Expected: All 4 tests PASS (3 existing + 1 new).

- [ ] **Step 3: Commit**

```bash
git add apps/judicial-system/backend/src/app/modules/case/test/limitedAccessCaseController/getCaseFilesRecordPdf.spec.ts
git commit -m "test(j-s): add integration test for defender police case number access restriction"
```

---

### Task 6: Run full test suite and verify

- [ ] **Step 1: Run all judicial-system backend tests**

Run: `npx jest apps/judicial-system/backend --no-coverage`

Expected: All tests PASS with no regressions.

- [ ] **Step 2: Run lint**

Run: `npx nx lint judicial-system-backend`

Expected: No new lint errors.

- [ ] **Step 3: Final commit if any fixes were needed**

Only commit if lint or test fixes were required.
