# PRD: BE Driving License Application Flow

## Overview

Update the BE (trailer) driving license application flow to use new RLS/SGS backend endpoints for photo quality verification and to support inline health certificate upload with health declaration submission.

**Scope: BE flow ONLY.**

---

> **THE GOLDEN RULE**
>
> The B-temp, B-full, and B-full-renewal-65 application flows must be **completely unchanged** — in code, logic, UI, layout, validation, submission behavior, and user experience. If a user went through any of these three flows before and after this PR, they must see and experience exactly the same thing. No bug fixes, no refactors, no "improvements", no layout tweaks, no schema changes that affect them.
>
> If a shared file or component needs to change, the change must be **additive and gated** behind `applicationFor === BE`. If that's not possible, create a BE-specific copy of the file/component rather than modifying the shared one.
>
> **Verification:** After implementation, `git diff main` for every changed file must show that no code path reachable by B-temp, B-full, or 65+ is altered in any way.

---

## Stakeholders

- **Magnús Gíslason** — Backend developer (RLS/SGS API)
- **Tinna Berglind** — Product owner / tester
- **Fanney Thóra** — Coordinator
- **Kristján Albert Loftsson** — Frontend developer (island.is)

## Feature Flag

BE is behind the `isBEApplicationEnabled` feature flag (`DrivingLicenseFeatureFlags.ALLOW_BE_LICENSE`). The BE option only appears in the license type selector when this flag is enabled — it defaults to `false`.

This means our changes will not affect production users until the flag is turned on. However, the golden rule still applies: since all license types share the same template codebase, any change to shared code could break the other flows regardless of the flag.

## Background

The BE license application previously had placeholder/TODO logic for health certificates and photo handling. The RLS backend now supports:

1. New endpoints to check if the applicant has a quality-certified photo and signature
2. Accepting health declaration answers and health certificate file uploads directly in the BE submission
3. Accepting Thjodskra biometric IDs for photo/signature when no quality photo exists

---

## Non-BE Constraint (Critical)

The following rules ensure non-BE flows are unaffected. Some shared files WILL be modified, but only in ways that are additive and gated behind BE conditions. The test: if you trace any code path for B-temp, B-full, or 65+, the behavior must be identical to `main`.

### Files that MUST NOT be modified at all

| File | Rule |
|------|------|
| `formUtils.ts` | Do not touch. `hasNoDrivingLicenseInOtherCountry`, `needsHealthCertificateCondition` — no changes. |
| `sectionFakeData.ts` | Do not touch. Fake data options stay as-is (improvements can come in a separate PR). |

### Files that will be modified — but non-BE behavior must stay identical

| File | What changes | What stays |
|------|-------------|------------|
| `HealthDeclaration.tsx` | **Intentional cross-flow UI improvement.** Layout fix (GridRow/GridColumn → Box with maxWidth), add `error` prop, remove BE dead-write tracking, fix defaultValue typing. See "Shared component rule" section below for details. | `onSelect` glasses mismatch check. Component is still used by all flows. |
| `subSectionQualityPhoto.ts` | Nothing in this file changes. BE photo selection is a **separate new file** (`subSectionQualityPhotoBE.ts`). | Everything. |
| `subSectionHealthDeclaration.ts` | New BE-specific multifield added. Shared multifield condition gets `&& answers.applicationFor !== BE` added — this doesn't affect B-full/B-temp (they already pass) or 65+ (already excluded). | Shared multifield content, 65+ multifield — untouched. |
| `subSectionSummary.ts` | BE-specific conditional logic added for health cert display. | All non-BE summary behavior untouched. |
| `driving-license-submission.service.ts` | BE block rewritten. `createLicense` signature gets `application` parameter added (existing flows ignore it). `AttachmentS3Service` injected. | B-full, B-temp, 65+ blocks — untouched. |
| `dataSchema.ts` | Add `selectLicensePhoto` (optional), `healthCertificate` (optional). Remove `healthDeclarationValidForBELicense` validation (was BE-only blocker). | `willBringQualityPhoto` stays required. All other fields stay. |
| `extractReasons.ts` | Remove `beRequiresHealthCertificate` switch case (was BE-only). | All other cases untouched. |
| `fakeEligibility.ts` | BE case updated. | B-full, B-temp, 65+ cases untouched. |
| `useEligibility.ts` | BE block rewritten. Variables only used by BE block can be removed. | Non-BE return paths untouched. |

### Shared component rule

Do not alter shared components unless explicitly noted below. If BE needs different component behavior, create a BE-specific variant or use conditional logic **inside the BE multifield only**.

**Exception — `HealthDeclaration.tsx` UI improvement (applies to ALL flows):**

The production `HealthDeclaration.tsx` uses `GridRow`/`GridColumn` for layout, which causes the yes/no radio buttons to stretch across the full viewport on some screen sizes. This is a UI issue for all flows, not just BE.

The following changes are intentional cross-flow improvements to this component:

1. **Layout fix:** Replace `GridRow`/`GridColumn` with `Box` + `maxWidth: 200px` to constrain the yes/no radio buttons to a sensible width on all viewports. Label text gets its own `Box` with `marginBottom: 1`.
2. **Add `error` prop:** Pass `error` from `FieldBaseProps` through to `RadioController` so validation errors display correctly.
3. **Remove BE dead-write tracking:** Remove the `healthDeclarationValidForBELicense` push/filter logic from `onSelect` (this was a TODO/temporary hack, and the schema validation it depends on is also being removed). Also remove the `getValues` import and `BE` constant import that were only used by this tracking code.
4. **Fix `defaultValue` typing:** Change `as string[]` cast to `getValueViaPath<string>` for correctness.

See the reference branch diff of `HealthDeclaration.tsx` for the exact changes. This component is used by all flows — the layout improvement benefits everyone.

---

## Requirements

### 1. New Data Providers (BE only)

BE uses its own set of photo endpoints — it does NOT use the old `QualityPhotoApi` that B-full, B-temp, and 65+ use. The old `QualityPhotoApi` must remain unchanged and untouched.

#### 1a. GetQualityPhotoAndSignatureApi (NEW — BE only)

Calls the new combined endpoint to check if the applicant has a quality-certified photo AND retrieve the photo image data in a single call.

- **Endpoint:** `GET /api/imagecontroller/v5/getqualityphotoandsignature`
- **Auth:** JWT token (Bearer token from auth)
- **Response DTO:** `GetQualityPhotoAndSignatureDto`
  - `imageId: number | null`
  - `imageTypeId: number | null` — **1 or 11 = quality certified photo**
  - `imageTypeName: string | null`
  - `imageDate: string | null`
  - `pohto: string | null` — **photo in base64** (note: `pohto` is a typo in the RLS API, not `photo`)
  - `signatureId: number | null`
  - `signatureTypeId: number | null` — **12 = quality signature**
  - `signatureTypeName: string | null`
  - `signatureDate: string | null`
  - `signature: string | null` — signature in base64
- **Registration:** Must be added to `sectionExternalData.ts` AND `drivingLicenseTemplate.ts` state machine API list
- **Error handling:** Return null on error (non-blocking — we fall back to Thjodskra photos)
- **Why `get` instead of `has`:** The `get` variant is a superset of `has` — it returns the same type IDs for certification checking PLUS the actual image data for display. One call instead of two.
- **This provider is for BE.** Other license types don't use the data, but the API call will fire for all flows during prerequisites (this is how the data provider system works — all registered providers run). This is acceptable; just don't reference this data in non-BE code paths.

#### 1b. AllPhotosFromThjodskraApi (BE only)

Fetches all photos from Thjodskra (national registry) for the applicant. Used as fallback when no quality photo is confirmed.

- **Endpoint:** `GET /api/imagecontroller/v5/fromnationalregistry/withagerestriction`
- **Response:** Array of `{ biometricId, content (base64), contentSpecification: 'FACIAL' | 'SIGNATURE' }`
- **Already defined** in `@island.is/application/types` — just needs to be registered in `sectionExternalData.ts` and the state machine
- **This provider is for BE.** Same as above — the API call fires for all flows, but only BE references the data. Do not add any non-BE logic that depends on this data.

### 2. BE Eligibility (Prerequisites Step)

**File:** `useEligibility.ts` — only modify the `applicationFor === BE` block.

Current production BE eligibility checks:
- `hasGlasses` (glasses check)
- `hasQualityPhoto` (old quality photo check)
- `hasOtherCategoryOrHealthRemarks` (category/remark check)
- `beRequiresHealthCertificate` requirement — this was a temporary blocker that prevented BE users from proceeding if they had glasses or health conditions, because the old BE flow couldn't handle health certificates at all. No longer needed since we now handle health declarations + file upload properly in the form.

**New BE eligibility:**

```
hasUsablePhotoForBE =
  qualityPhotoConfirmed (imageTypeId 1 or 11 from GetQualityPhotoAndSignatureApi)
  OR thjodskraPhotos has at least one FACIAL photo

isEligible = graphqlEligibility.isEligible AND hasUsablePhotoForBE

requirements = [
  ...graphqlRequirements,
  { key: RequirementKey.hasNoPhoto, requirementMet: hasUsablePhotoForBE }
]
```

**Remove from BE block:**
- `beRequiresHealthCertificate` requirement (was a temporary blocker — health cert is now handled in the form with file upload)
- `hasGlasses` check (glasses are part of health declaration, handled in form)
- `hasOtherCategoryOrHealthRemarks` check (same — handled in form)

**Also remove from `extractReasons.ts`:** The `beRequiresHealthCertificate` switch case can be deleted. New BE applications will never produce this requirement key, and eligibility data is fetched fresh each time (not stored), so no stale data risk.

**Also remove from `dataSchema.ts`:** The `healthDeclarationValidForBELicense` validation (`.refine((v) => v === undefined || v.length === 0)`) was part of the same temporary blocker — it blocked form submission if any health question was answered "yes" for BE. Remove it. The `HealthDeclaration.tsx` component will still write to this field for BE (dead writes), but that's harmless. Do NOT modify the component itself — leave it as-is to protect other flows.

**DO NOT remove** variables/functions from the file if they are used by non-BE code paths. If they are only used in the BE block, they can be removed.

### 3. BE Photo Selection (Draft Step)

**Goal:** Show the user what photo will be used for their BE license. No "bring new photo" option — a usable photo must exist (enforced at eligibility).

**Implementation approach:** Since `subSectionQualityPhoto.ts` is shared and must not change for other flows, the BE photo selection should be implemented as either:

- A **separate subsection** (e.g., `subSectionQualityPhotoBE.ts`) included conditionally in `getForm.ts`, OR
- A **new multifield inside the existing subsection** with `condition: (answers) => answers.applicationFor === BE`, alongside the existing multifields which get `condition: (answers) => answers.applicationFor !== BE` added

**Recommended: separate file** to keep changes isolated.

#### Wiring in `getForm.ts`

The draft form (`forms/draft/getForm.ts`) lists subsections in the `info` section's `children` array. To conditionally include the BE photo step without touching the existing `subSectionQualityPhoto`:

```typescript
// In the children array, include both — each has its own condition
subSectionQualityPhoto,      // existing — already conditioned on B_FULL and B_FULL_RENEWAL_65
subSectionQualityPhotoBE,    // new — conditioned on BE
```

The existing `subSectionQualityPhoto` already has `condition: isVisible(isApplicationForCondition([B_FULL, B_FULL_RENEWAL_65]), ...)` so it won't show for BE. The new `subSectionQualityPhotoBE` has `condition: (answers) => answers.applicationFor === BE`. Both can coexist — the form system only renders the one whose condition matches.

#### Photo options to show (in order):

1. **Thjodskra facial photos** — from `allPhotosFromThjodskra.data.images` where `contentSpecification === 'FACIAL'`. Show with base64 image preview from `content` field. Value = `biometricId`.
2. **Quality photo** — from `getQualityPhotoAndSignature.data.pohto` (NEW provider, NOT the old `QualityPhotoApi`). Show with base64 image preview. Value = `'qualityPhoto'`. Only show if `pohto` is non-null.
3. **NO "bring new photo" option** for BE.

**Important:** BE does NOT use `qualityPhoto.data.qualityPhoto` (the old `QualityPhotoApi`). It uses the new `getqualityphotoandsignature` endpoint for both certification check and image display.

#### Answer field: `selectLicensePhoto`

- New field in `dataSchema.ts`: `selectLicensePhoto: z.string().optional()`
- Must be `.optional()` because non-BE flows don't use it (they keep using `willBringQualityPhoto`)

#### Default value logic:
1. If fake data and qualityPhoto = YES → `'fakePhoto'`
2. If quality photo exists (from `getQualityPhotoAndSignature.data.pohto`) → `'qualityPhoto'`
3. If Thjodskra facial photos exist → first photo's `biometricId`
4. Otherwise → `undefined` (shouldn't happen — eligibility blocks this)

### 4. BE Health Declaration (Draft Step)

**Goal:** BE gets its own health declaration section with all 10 health questions. Health certificate file upload is **mandatory** when any health condition is triggered.

**Health declaration is ALWAYS shown for BE.** The `healthDeclarationModel` is ALWAYS sent at submission — with `false` values if all questions are "no".

**Health certificate file upload is mandatory when ANY of these are true:**
- Any of the 10 health questions is answered "yes"
- `hasHealthRemarks` is true
- `glassesCheck` is true (glasses alert triggered)

The user **cannot proceed** without uploading a certificate when any of these conditions are met. This is enforced by `needsHealthCertificateCondition(YES)` — which already checks all three conditions. Do NOT modify this shared function.

**Implementation approach:** Add a new multifield inside `subSectionHealthDeclaration.ts` with `condition: (answers) => answers.applicationFor === BE`. The existing shared multifield gets `&& answers.applicationFor !== BE` added to its condition (this is acceptable — it doesn't change behavior for B-full, B-temp, or 65+ since BE was previously not excluded). The existing multifields stay unchanged otherwise.

#### BE health declaration multifield contains:

1. Description field with `m.healthDeclarationSubTitle`
2. HealthRemarks component (if applicable)
3. All 10 health declaration custom fields (same IDs as shared block — `healthDeclaration.usesContactGlasses`, etc.). Uses the existing shared `HealthDeclaration.tsx` component as-is — do NOT modify the component.
4. Glasses mismatch alert
5. Health certificate info description (conditional on `needsHealthCertificateCondition(YES)`)
6. **Health certificate file upload** (conditional on `needsHealthCertificateCondition(YES)`)

#### File upload field:
- ID: `healthCertificate`
- Max size: 10MB
- Accept: `.pdf, .jpg, .jpeg, .png`
- Schema: `healthCertificate: z.array(z.object({ name: z.string(), key: z.string() })).optional()`

**Note:** The `healthCertificate` schema field must be `.optional()` since non-BE flows don't upload files.

### 5. BE Summary (Draft Step)

The summary step needs BE-specific logic for the health certificate section. Three scenarios:

1. **BE + health cert uploaded** (any health condition triggered, user uploaded file):
   - Hide the "bring along" text and certificate checkbox
   - Show the uploaded file name(s) instead

2. **BE + no health cert needed** (all health questions "no", no remarks, no glasses):
   - Hide the "bring along" text and certificate checkbox entirely
   - No file upload info to show — skip the section

3. **Non-BE flows:** Unchanged. They still show the "bring along" text and certificate checkbox when `needsHealthCertificateCondition` is met.

**Implementation:** Add BE-specific conditional logic in `subSectionSummary.ts`, gated on `applicationFor === BE`. The existing non-BE conditions and fields stay untouched.

### 6. BE Submission

**File:** `driving-license-submission.service.ts` — only modify the `applicationFor === 'BE'` block.

#### Photo handling — follows user selection:

```typescript
const selectedPhoto = getValueViaPath<string>(answers, 'selectLicensePhoto')

if (selectedPhoto === 'qualityPhoto') {
  // User selected the RLS quality photo — backend already has it
  photoBiometricsId = null
  signatureBiometricsId = null
} else {
  // User selected a Thjodskra photo — send its biometric IDs
  // Validate selectedPhoto against allThjodskraPhotos to confirm it's a real biometricId
  const allThjodskraPhotos = externalData['allPhotosFromThjodskra']?.data?.images ?? []
  const isValidThjodskra = allThjodskraPhotos.some(p => p.biometricId === selectedPhoto)

  photoBiometricsId = isValidThjodskra ? selectedPhoto : null
  signatureBiometricsId = isValidThjodskra
    ? allThjodskraPhotos.find(p => p.contentSpecification === 'SIGNATURE')?.biometricId ?? null
    : null
}
```

**Key:** The submission follows what the user picked in the photo selection step — NOT a server-side check. If they chose the RLS quality photo, no IDs needed. If they chose a Thjodskra photo, send its biometric IDs.

#### Health certificate handling (only when health conditions triggered):

```typescript
// Only read files if health conditions require a certificate
if (needsHealthCert) {
  const files = await attachmentS3Service.getFiles(application, ['healthCertificate'])

  contentList = files.filter(f => f.fileContent).map(f => ({
    fileName: f.fileName,
    fileExtension: ext,
    contentType: 'application/pdf' | 'image/jpeg' | etc,
    content: f.fileContent,
    description: 'Laeknisvottord',
  }))
}
// If no health conditions triggered, contentList remains undefined
```

#### Health declaration model — ALWAYS sent for BE:

```typescript
// Convert form answers ('yes'/'no' strings) to boolean model
// ALWAYS sent — even if all answers are 'no' (all false)
healthDeclarationModel = {
  isDisabled: healthDeclaration.isDisabled === 'yes',
  hasDiabetes: healthDeclaration.hasDiabetes === 'yes',
  hasEpilepsy: healthDeclaration.hasEpilepsy === 'yes',
  isAlcoholic: healthDeclaration.isAlcoholic === 'yes',
  hasHeartDisease: healthDeclaration.hasHeartDisease === 'yes',
  hasMentalIllness: healthDeclaration.hasMentalIllness === 'yes',
  hasOtherDiseases: healthDeclaration.hasOtherDiseases === 'yes',
  usesMedicalDrugs: healthDeclaration.usesMedicalDrugs === 'yes',
  usesContactGlasses: healthDeclaration.usesContactGlasses === 'yes',
  hasReducedPeripheralVision: healthDeclaration.hasReducedPeripheralVision === 'yes',
}
```

#### Final BE submission call:

```typescript
drivingLicenseService.applyForBELicense(nationalId, auth, {
  jurisdiction: jurisdictionId,
  instructorSSN,
  primaryPhoneNumber,
  studentEmail,
  contentList,           // health cert files (or undefined)
  photoBiometricsId,     // null if quality photo confirmed
  signatureBiometricsId, // null if quality photo confirmed
  healthDeclarationModel,
})
```

#### Shared code changes required for submission:

- **`createLicense` signature change:** The private method currently has signature `(nationalId, answers, auth)`. It needs `application` added: `(nationalId, answers, auth, application)`. This is because the BE block needs access to `application.externalData` (photo quality data) and the `application` object (for S3 file retrieval). The call site in `submitApplication` changes too. B-full, B-temp, and 65+ branches inside `createLicense` simply ignore the extra parameter — their logic is untouched.
- **`AttachmentS3Service` must be injected** into the submission service constructor (for reading uploaded files from S3).
- `applyForBELicense` in the domain service must pass through `contentList`, `photoBiometricsId`, `signatureBiometricsId`, and `healthDeclarationModel`
- The driving license API client must support these fields (update OpenAPI spec if needed)

### 7. API Client Updates

The v5 OpenAPI spec may need updating to include the new endpoints and request models.

```bash
yarn nx run clients-driving-license:update-openapi-document --apiVersion=v5
yarn nx run clients-driving-license:codegen/backend-client
```

If the staging spec doesn't include the endpoints yet, coordinate with Magnus.

Fields needed in `applyForBELicense` client call:
- `photoBiometricsId: string | null`
- `signatureBiometricsId: string | null`
- `contentList: Array<{ fileName, fileExtension, contentType, content, description }> | undefined`
- `healthDeclarationModel: { isDisabled, hasDiabetes, ... } | undefined`

### 8. Fake Data Support

Update fake data to work with BE-specific changes:
- `fakeData.qualityPhoto === YES` → BE eligibility passes photo check
- Fake eligibility for BE should include `hasNoPhoto` requirement
- When using fake data and BE, submission should skip RLS call (existing behavior)

**Only modify BE paths in fake data.** Do not change fake data for other flows.

### 9. New Messages

New message keys are needed for the BE photo selection and health cert upload UI. Check the reference branch (`libs/application/templates/driving-license/src/lib/messages.ts`) for examples. Messages needed include:
- Photo selection title and description
- Labels for photo options (e.g., "use passport photo", "use driver's license photo", fake photo label)
- Health certificate upload title, header, description, button label
- Health certificate description/info text
- Summary display for uploaded health certificate

Add new messages to `messages.ts`. Do NOT modify or remove existing messages — they may be used by non-BE flows or referenced in Contentful translations.

### 10. Error Handling — Data Provider Failures

If `GetQualityPhotoAndSignatureApi` returns null or errors:
- **Eligibility:** `hasQualityPhotoForBE = false`. Falls through to Thjodskra check. If Thjodskra also has no FACIAL photo, user is blocked with the `hasNoPhoto` requirement shown as failed.
- **Photo selection:** No quality photo option shown, only Thjodskra photos. If neither exists, the user shouldn't reach this step (blocked at eligibility).

If `AllPhotosFromThjodskraApi` returns null or errors:
- **Eligibility:** `hasThjodskraFacial = false`. If quality photo is also not confirmed, user is blocked.
- **Photo selection:** No Thjodskra options shown. Only quality photo option if available.

Both providers failing = user blocked at eligibility. This is the intended behavior — we can't proceed without a usable photo.

---

## Implementation Checklist

### Layer 1: API Client
- [ ] Update v5 OpenAPI spec (if needed)
- [ ] Run codegen
- [ ] Add `getQualityPhotoAndSignature` method to `drivingLicenseApi.service.ts` (calls `getqualityphotoandsignature`)
- [ ] Add `QualityPhotoAndSignature` type to `drivingLicenseApi.types.ts` (include `pohto` base64 field)

### Layer 2: Domain Service
- [ ] Pass `healthDeclarationModel` through `applyForBELicense` in domain service
- [ ] Pass `contentList`, `photoBiometricsId`, `signatureBiometricsId` through

### Layer 3: Shared API / Data Providers
- [ ] Add `getQualityPhotoAndSignature` data provider method in shared driving-license service
- [ ] Register `GetQualityPhotoAndSignatureApi` in application types
- [ ] Register `AllPhotosFromThjodskraApi` in `sectionExternalData.ts`
- [ ] Register `GetQualityPhotoAndSignatureApi` in `sectionExternalData.ts`
- [ ] Register both in `drivingLicenseTemplate.ts` state machine API list

### Layer 4: Template (Frontend)
- [ ] Update `HealthDeclaration.tsx` — cross-flow UI fix: Box layout with maxWidth, add error prop, remove BE dead-write tracking (see "Shared component rule")
- [ ] Update `dataSchema.ts` — add `selectLicensePhoto` (optional), `healthCertificate` (optional), remove `healthDeclarationValidForBELicense` validation
- [ ] Update `useEligibility.ts` — BE block only
- [ ] Update `fakeEligibility.ts` — BE case only
- [ ] Update `extractReasons.ts` — remove `beRequiresHealthCertificate` case
- [ ] Add new messages to `messages.ts` (photo selection, health cert upload — see section 9)
- [ ] Create `subSectionQualityPhotoBE.ts` — BE photo selection subsection
- [ ] Add BE health declaration multifield in `subSectionHealthDeclaration.ts` (add `&& applicationFor !== BE` to shared multifield condition)
- [ ] Update `subSectionSummary.ts` — BE-specific health cert display
- [ ] Wire up `subSectionQualityPhotoBE` in `getForm.ts` alongside existing `subSectionQualityPhoto`
- [ ] Create `CreatePhoto` component (for rendering base64 photo previews in radio options)

### Layer 5: Submission
- [ ] Add `application` parameter to `createLicense` signature and update call site in `submitApplication`
- [ ] Inject `AttachmentS3Service` into submission service
- [ ] Update BE block with photo logic (follows user selection — quality photo vs Thjodskra biometric IDs)
- [ ] Update BE block with health cert file reading from S3
- [ ] Update BE block with health declaration model conversion (always sent, even if all false)

### Layer 6: Testing
- [ ] Unit tests pass (`yarn test application-templates-driving-license`)
- [ ] Manual test: BE flow with quality photo (imageTypeId 1 or 11)
- [ ] Manual test: BE flow with Thjodskra photo only
- [ ] Manual test: BE flow with health cert upload
- [ ] Manual test: B-temp flow unchanged
- [ ] Manual test: B-full flow unchanged
- [ ] Manual test: 65+ flow unchanged
- [ ] Manual test: Fake data for all flows

---

## Reference Branch

The branch `feat/driving-license-be-additions` contains a previous implementation attempt. It can be used as a **reference only** — do not cherry-pick or merge from it directly.

Useful things to look at in that branch:
- **API client work:** `libs/clients/driving-license/src/v5/clientConfig.json` (updated OpenAPI spec), `drivingLicenseApi.service.ts` (has a `getHasQualityPhotoAndSignature` method — note: this calls the `has` endpoint, but the PRD now specifies using the `get` endpoint instead for BE; adapt accordingly), `drivingLicenseApi.types.ts` (new types)
- **Domain types:** `libs/api/domains/driving-license/src/lib/drivingLicense.type.ts` (`NewBEHealthDeclaration`, updated `NewBEDrivingLicenseInput`)
- **Domain service:** `libs/api/domains/driving-license/src/lib/drivingLicense.service.ts` (passthrough for new fields)
- **Data provider:** `libs/application/template-api-modules/src/lib/modules/shared/api/driving-license/driving-license.service.ts` (`qualityPhotoAndSignature` method)
- **Shared API definition:** `libs/application/types/src/lib/template-api/shared-api-definitions/driving-license.ts` (`QualityPhotoAndSignatureApi`)
- **CreatePhoto component:** `libs/application/templates/driving-license/src/fields/CreatePhoto/index.tsx`
- **New messages:** `libs/application/templates/driving-license/src/lib/messages.ts` (photo selection and health cert upload messages)
- **v4/v5 mapper fix:** `libs/clients/driving-license-client/drivingLicenseMapper.ts` (`Partial<CategoryDto>`)
- **Postman collection:** `tools/postman/driving-license-v5.postman_collection.json`
- **BE submission logic:** The `applicationFor === 'BE'` block in `driving-license-submission.service.ts` (photo handling, health cert reading, health declaration model)

**Critical warning:** That branch also contains changes that accidentally modified non-BE flows (photo step rewrite, health declaration layout changes, formUtils changes, schema changes). Do NOT copy those patterns. Always diff your changes against `main` and verify that no code path reachable by B-temp, B-full, or 65+ is altered.

---

## Known Gotchas

Lessons learned from the first implementation attempt. Read these before starting.

### Data Provider Registration

- **Two places required.** Every new data provider must be registered in BOTH `sectionExternalData.ts` (UI) AND the `api` array in `drivingLicenseTemplate.ts` (state machine permissions). Missing the state machine entry causes a `400 "Current user is not permitted to update external data"` error at runtime — hard to debug because the error message doesn't mention which provider failed.

### API Client / Codegen

- **v5 OpenAPI spec update is a huge diff.** `clientConfig.json` changes by ~3000 lines because the entire spec gets regenerated. This is normal but makes PR reviews noisy — note it in the PR description so reviewers don't get alarmed.
- **v4/v5 `CategoryDto` type conflict.** Updating the v5 spec regenerates `CategoryDto` where `id` changes from `number | undefined` (v4) to `number` (v5). This breaks `drivingLicenseMapper.ts`. Fix with `Partial<CategoryDto>` or a union type for the mapper's parameters.
- **Generated method names are very long.** The `hasqualityphotoandsignature` endpoint generates `apiImagecontrollerV5HasqualityphotoandsignatureGet`. Don't try to guess — check the generated client.
- **JWT parameter is `jwttoken`** — lowercase, no separator. Must match exactly.
- **Both `apiVersion` AND `apiVersion2` are required** in generated client calls. Both must be set to `v5.DRIVING_LICENSE_API_VERSION_V5`. Easy to miss the second one.
- **`ImageApi` is a separate class** from existing v5 API clients. It needs to be instantiated in the provider module and injected into the service (e.g., as `imageApiV5`).
- **Import namespaces matter.** v5 types come from `import * as v5 from '../v5'`. Make sure new types are imported from the correct version namespace, not mixed with v4.

### RLS API Quirks

- **`healtCertificate` is misspelled** in the RLS OpenAPI spec (missing 'h'). The generated types use this spelling. Cannot fix on our side — must use the misspelled field name `healtCertificate` in code.
- **`pohto` is misspelled** in `GetQualityPhotoAndSignatureDto` (should be `photo`). The generated types use this spelling. Must use `pohto` to access the base64 image data.
- **Production BE submission sends almost nothing.** Current prod call only sends `jurisdiction`, `instructorSSN`, `primaryPhoneNumber`, `studentEmail`. All new fields (`contentList`, `photoBiometricsId`, `signatureBiometricsId`, `healthDeclarationModel`) are additions.

### Template / Form System

- **Photo step doesn't exist for B-temp or BE in production.** The condition is `isApplicationForCondition([B_FULL, B_FULL_RENEWAL_65])`. Adding a BE photo step must not accidentally include B-temp.
- **BE does NOT use the old `QualityPhotoApi`.** BE uses `getqualityphotoandsignature` (for certification check + image display) and `fromnationalregistry/withagerestriction` (for Thjodskra fallback). The old `QualityPhotoApi` is used by B-full and 65+ and must remain untouched.
- **Biometric ID validation is critical.** `selectLicensePhoto` can hold UI-only values like `'qualityPhoto'`, `'fakePhoto'`, `'bringNewPhoto'`. These must NEVER be sent as biometric IDs to the API. Always validate against the actual `allThjodskraPhotos` array.
- **`needsHealthCertificateCondition` is shared across flows.** It checks `externalData.glassesCheck?.data === true`. Do not modify this function — use BE-specific logic inline if needed.
- **`healthDeclarationValidForBELicense` exists in production.** The schema has `z.array(z.string()).refine((v) => v === undefined || v.length === 0)` and the `HealthDeclaration.tsx` component tracks BE state in this field. Our new BE flow replaces this mechanism — handle the schema change carefully for in-flight applications.
- **`HealthDeclaration.tsx` has BE-specific tracking** in its `onSelect` handler that pushes field IDs into `healthDeclarationValidForBELicense`. This tracking code is being removed as part of the intentional cross-flow UI improvement to this component (see "Shared component rule" section). The schema validation it depends on is also being removed.

### Submission Service

- **`AttachmentS3Service` must be injected** into the submission service constructor. It wasn't previously a dependency for driving license.
- **`application` must be passed to `createLicense`** — the method needs access to `externalData` for photo quality check and to the application object for S3 file retrieval. Production signature only has `(nationalId, answers, auth)`.

---

## Out of Scope

- Photo selection UI changes for B-full, B-temp, or 65+
- Health certificate upload for B-full, B-temp, or 65+
- HealthDeclaration component layout/UI changes
- `hasNoDrivingLicenseInOtherCountry` bug fix (separate PR)
- Fake data improvements for non-BE flows (separate PR)
- Changes to `formUtils.ts` shared functions
