# LSH Questionnaire Mappers

This folder contains mappers that transform **LSH** API DTOs into the internal `Questionnaire` GraphQL model used by the API and portals, and also map answers to LSH.

The code is split by responsibility and folder:

- `display/` – map LSH questionnaire DTOs into the internal `Questionnaire` model used for rendering.
- `answer/` – map internal answer input into the DTO used when submitting to LSH.

## Display

Located in `display/`. These mappers are used when **reading** questionnaires from LSH.

- Main entry: `mapLshQuestionnaire(form)`.
- Uses `mapSection` and `mapQuestion` to build sections and questions.
- Parses visibility expressions via `parseVisibility` to build `dependsOn` and `visibilityConditions`.

## Answer

Located in `answer/`. These mappers are used when **submitting** answers back to LSH.

- Main entry: `mapToLSHAnswer(input)`.
- Takes our internal `QuestionnaireInput` and produces the LSH submit DTO.

## Display mapper detail

### Main entry points

- `mapLshQuestionnaire(form)`
  - Input: `QuestionnaireBody` from `@island.is/clients/lsh`.
  - Output: `Questionnaire` from `src/models/questionnaire.model.ts`.

The mapper:

- Fills `baseInformation` (id, formId, title, description, organization, sentDate).
- Maps `sections` from LSH into `QuestionnaireSection[]` via `mapSection`.
- Within each section, maps questions via `mapQuestion`.

### Section-level mapping

- `mapSection(section)`
  - Maps an LSH `Section` into a `QuestionnaireSection`.
  - Copies the `caption` as the section title.
  - Flattens `section.questions` and maps each question with `mapQuestion`.

### Question-level mapping

- `mapQuestion(q)`
  - Converts an LSH `QuestionType` into our internal `Question` model.
  - Determines `answerOptions.type` using `mapAnswerOptionType(type, slider)`.
    - In some cases, checking for `displayClass` is necessary to determine the type
  - Builds `answerOptions`:
    - `placeholder` from `instructions`.
    - `options` from LSH `options` (with a stable synthetic `id` using `value + label`).
    - numeric fields (`min`, `max`, `maxLength`) and `formula`, normalized to strings.

### Visibility and dependencies

- Visibility is expressed in the LSH API by:
  - A **string expression** field: `visible` (e.g. `"@@@Q1 == 'yes'"`).
  - An optional `dependsOn: string[]` array.
- `mapQuestion` calls `parseVisibility(visible, dependsOn)` to:
  - Parse `visible` into normalized `VisibilityCondition[]` (e.g. `equals`, `greaterThan`, `contains`, etc.).
  - Add fallback **existence** conditions when only `dependsOn` is provided.
- Dependencies are collected from two places:
  - From parsed `visibilityConditions` (referenced question ids).
  - From explicit `dependsOn` on the question.
- These are merged and de-duplicated into:
  - `question.visibilityConditions`.
  - `question.dependsOn` (only set when there is at least one dependency).

## How LSH differs from EL mappers

- **No draft support:**

  - LSH mappers do **not** create `draftAnswers`. They only describe the structure and visibility of the questionnaire.
  - EL mappers, on the other hand, can turn `replies` into `draftAnswers`.

- **Expression-based visibility vs. triggers:**

  - LSH uses **string expressions** (e.g. `isSelected('yes', @@@Q1)`, comparisons, `&&`/`||`) that are parsed by `parseVisibility`.
  - EL uses structured **triggers** which are mapped by `mapTriggers` / `mapGroupTriggers`.

- **Slightly different type systems:**
  - LSH question types (`String`, `Number`, `SingleSelect`, `MultiSelect`, `Slider`, etc.) are mapped by `mapAnswerOptionType` to internal `AnswerOptionType`.
  - EL uses its own type strings and display classes, handled in the EL mappers.

## Tests

End-to-end mapping for both EL and LSH (including `dependsOn` / `visibilityConditions`) is covered in:

- `src/lib/transform-mappers/display.mappers.spec.ts`

Use Nx to run tests for this library:

```bash
yarn nx test api-domains-questionnaires
```
