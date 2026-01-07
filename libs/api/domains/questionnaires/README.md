# Health Questionnaires – Models and Mappers

This library provides the GraphQL models and mapping logic used for health-related questionnaires in the API and portals.

It sits between external providers (LSH and the Health Directorate/EL) and the internal `Questionnaire` model exposed over GraphQL.

## What this library contains

- GraphQL object types for:
  - `Questionnaire`, `QuestionnaireSection`, `Question`, `QuestionnaireDraftAnswer`, etc.
  - Enums such as `QuestionnairesStatusEnum` and `QuestionnaireAnswerOptionType`.
- Display mappers for **LSH** and **EL** that turn their respective DTOs into the internal `Questionnaire` shape.
- Helper logic for:
  - Visibility and dependencies (`dependsOn`, `visibilityConditions`).
  - Draft answers for EL questionnaires.

## Providers and mapping

### LSH mappers

Located under `src/lib/transform-mappers/lsh`.

- **Entry point:** `mapLshQuestionnaire(form)`
  - Input: `QuestionnaireBody` from `@island.is/clients/lsh`.
  - Output: `Questionnaire` from `src/models/questionnaire.model.ts`.
- Sections and questions:
  - `mapSection` maps LSH `Section` → `QuestionnaireSection`.
  - `mapQuestion` maps LSH `QuestionType` → internal `Question`.
- Visibility and dependencies:
  - LSH exposes a string visibility expression (`visible`) and an optional `dependsOn: string[]`.
  - `parseVisibility` parses expressions like `@@@Q1 == 'yes'` or `isSelected('x', @@@Q1)` into `VisibilityCondition[]`.
  - `mapQuestion` merges:
    - Question ids referenced in `visibilityConditions`.
    - Explicit `dependsOn`.
  - The merged, de-duplicated set becomes `question.dependsOn`.
- Drafts:
  - LSH mappers only describe structure and visibility; they do **not** generate `draftAnswers`.

See `src/lib/transform-mappers/lsh/README.md` for more detail.

### EL (Health Directorate) mappers

Located under `src/lib/transform-mappers/el`.

- **Entry point:** `mapELQuestionnaire(q, locale)`
  - Input: `QuestionnaireDetailDto` (detailed) or `QuestionnaireBaseDto` (summary) from `@island.is/clients/health-directorate`.
  - Output: `Questionnaire`.
- Sections and questions:
  - `mapGroupToSection` maps EL `QuestionGroupDto` → `QuestionnaireSection`.
  - `mapItemToQuestion` maps EL question DTOs → internal `Question` and `answerOptions`.
- Triggers, visibility, and dependencies:
  - EL uses structured **triggers** instead of visibility expressions.
  - `mapGroupTriggers` and `mapTriggers` convert these into:
    - `dependsOn: string[]` (which questions this group/question depends on).
    - `visibilityConditions: VisibilityCondition[]` controlling when to show.
- Draft support (EL only):
  - For detailed questionnaires, `replies` from EL are mapped into `draftAnswers` via `mapDraftRepliesToAnswers`.
  - This enables saving and resuming questionnaire drafts in the portals.

See `src/lib/transform-mappers/el/README.md` for more detail.

## Using the models in resolvers

### Fetching questionnaires

Resolvers typically:

1. Call the appropriate client (`LshClientService` or `HealthDirectorateHealthService`).
2. Pass the DTO into the correct mapper (`mapLshQuestionnaire` or `mapELQuestionnaire`).
3. Return the resulting `Questionnaire` object from GraphQL.

### Submitting questionnaire answers

The answer submission flow follows these steps:

**Entry point:** `submitQuestionnaire` mutation in `QuestionnairesResolver`

- Accepts `QuestionnaireInput` (contains user answers from the portal)
- Routes to `QuestionnairesService.submitQuestionnaire()`

**Service layer flow:**

1. Determine the organization (`LSH` or `EL`) from the input
2. Use the appropriate reverse mapper to convert GraphQL DTOs to provider payloads:
   - **For LSH:** `mapToLshAnswer(input)` → `AnsweredQuestionnaireBody`
     - Located in `src/lib/transform-mappers/lsh/answer/mapToLSHAnswer.ts`
     - Converts `QuestionnaireInput` into LSH's expected format
   - **For EL:** `mapToElAnswer(input)` → `SubmitQuestionnaireDto`
     - Located in `src/lib/transform-mappers/el/answer/mapToELAnswer.ts`
     - Converts `QuestionnaireInput` into Health Directorate's expected format
3. Call the appropriate client service with the mapped payload:
   - **LSH:** `LshClientService.postAnsweredQuestionnaire(user, locale, id, payload)`
   - **EL:** `HealthDirectorateHealthService.submitQuestionnaire(user, locale, id, payload)`
4. Return a `QuestionnairesResponse` with `success` and `message` fields

**End-to-end flow:**

```
User answers (portal)
  → GraphQL mutation (submitQuestionnaire)
    → QuestionnairesService.submitQuestionnaire()
      → mapToLshAnswer() OR mapToElAnswer()
        → LshClientService OR HealthDirectorateHealthService
          → External provider API
            → Response
              → QuestionnairesResponse (success/failure)
```

**Key points:**

- Always use the reverse mappers (`mapToLshAnswer` or `mapToElAnswer`) to ensure proper data transformation
- The mappers handle converting internal `QuestionnaireEntryInput` structures to provider-specific answer formats
- Error handling is built into the service layer and returns appropriate success/failure responses

## Running unit tests

This library has Jest tests configured via Nx.

- Display mappers (including `dependsOn` / visibility) are tested in:
  - `src/lib/transform-mappers/display.mappers.spec.ts`

Run the tests with:

```bash
yarn nx test api-domains-questionnaires
```
