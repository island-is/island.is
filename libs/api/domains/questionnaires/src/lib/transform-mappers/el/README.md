# EL Questionnaire Mappers

This folder contains mappers that transform **Health Directorate (EL)** API DTOs into the internal `Questionnaire` GraphQL model used by the API and portals, and also map answers and drafts to/from EL.

The code is split by responsibility and folder:

- `display/` – map EL questionnaire DTOs into the internal `Questionnaire` model used for rendering.
- `answer/` – map internal answer input into the DTO used when submitting to EL.
- `draft/` – map EL replies into internal draft answers.

## Display

Located in `display/`. These mappers are used when **reading** questionnaires from EL.

- Main entry: `mapELQuestionnaire(q, locale)`.
- Uses `mapGroupToSection`, `mapItemToQuestion`, `mapGroupTriggers`, and `mapTriggers` to build sections, questions, `dependsOn`, and `visibilityConditions`.
- For detailed questionnaires, it also wires in draft information from the draft mappers when `replies` are present.

## Answer

Located in `answer/`. These mappers are used when **submitting** answers back to EL.

- Main entry: `mapToELAnswer(input)`.
- Takes our internal `QuestionnaireInput` and produces the EL submit DTO (with the correct per-type reply structures).
- Shared helper types for replies and questions live in `types.ts`.

## Draft

Located in `draft/`. These mappers are used when **loading drafts** from EL.

- Main logic: `mapToDraft` / `mapDraftRepliesToAnswers`.
- Takes EL `replies` from a detailed `QuestionnaireDetailDto` and converts them into `QuestionnaireDraftAnswer[]` that are exposed as `draftAnswers` on the `Questionnaire`.

## Display mapper detail

### Main entry points

- `mapELQuestionnaire(q, locale)`
  - Input: `QuestionnaireDetailDto` (detailed) **or** `QuestionnaireBaseDto` (summary) from `@island.is/clients/health-directorate`.
  - Output: `Questionnaire` from `src/models/questionnaire.model.ts`.

### Detailed questionnaire (`QuestionnaireDetailDto`)

When `groups` and `triggers` are present, the mapper treats the input as a **detailed** questionnaire and:

- Fills `baseInformation` (id, title, description, status, organization, formId).
- Maps `groups` → `sections` via `mapGroupToSection`.
- Maps questions inside each group via `mapItemToQuestion`.
- Derives `dependsOn` and `visibilityConditions` from **triggers** using `mapGroupTriggers` and `mapTriggers`.
- Populates draft support:
  - `replies` from EL are converted to `draftAnswers` via `mapDraftRepliesToAnswers`.
- Copies EL metadata:
  - `expirationDate` ← `expiryDate`.
  - `canSubmit`.
  - `submissions` (id, createdAt, isDraft, lastUpdated).

### Summary questionnaire (`QuestionnaireBaseDto`)

When only base information is available (no `groups`/`triggers`), the mapper:

- Fills `baseInformation` and status based on `numSubmitted`.
- Leaves `sections`, `draftAnswers`, `submissions`, `canSubmit`, `expirationDate` as `undefined`.

### Question-level mapping

- `mapItemToQuestion(item, allQuestions, locale, triggers)`
  - Maps EL question types (`string`, `number`, `bool`, `list`, `table`, etc.) to `AnswerOptionType` via `mapAnswerOptionType`.
  - Builds `answerOptions` including:
    - options (including Yes/No for boolean questions, localized with `locale`).
    - min/max, maxLength, slider/thermometer configuration.
    - table-specific fields (rows, columns) when the type is `table`.
  - Merges trigger-based dependencies from `mapTriggers` into:
    - `question.dependsOn`.
    - `question.visibilityConditions`.

### Group-level mapping

- `mapGroupToSection(group, allQuestions, locale, triggers)`
  - Maps a `QuestionGroupDto` into a `QuestionnaireSection`.
  - Applies `mapGroupTriggers` so **sections can also be conditionally visible** based on other questions.

## How EL differs from LSH mappers

- **Draft support:**

  - EL mappers support drafts; `replies` are converted into `draftAnswers` on the `Questionnaire`.
  - LSH mappers currently do **not** handle drafts.

- **Triggers vs. visibility expressions:**

  - EL visibility is driven by structured **triggers** (`HealthDirectorateQuestionTriggers`).
    - Triggers are mapped to `dependsOn` + `visibilityConditions` at both section and question level.
  - LSH visibility is driven by a **string expression** (`visible`) plus `dependsOn`, parsed by `parseVisibility`.

- **Question types and options:**
  - EL uses its own type system (`bool`, `string`, `number`, `list`, `table`, …) and display classes (`slider`, `thermometer`).
  - `mapAnswerOptionType` here interprets those and maps them to internal `AnswerOptionType` values.

## Tests

End-to-end mapping for both EL and LSH (including `dependsOn` / `visibilityConditions`) is covered in:

- `src/lib/transform-mappers/display.mappers.spec.ts`

Use Nx to run tests for this library:

```bash
yarn nx test api-domains-questionnaires
```
