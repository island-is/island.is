# Questionnaires Component Library

This folder contains React components for rendering dynamic questionnaires in My Pages portal. The components consume questionnaire data from the GraphQL API (which is transformed from EL and LSH APIs) and provide an interactive form experience with validation, visibility logic, and formula calculations.

## Architecture

The library is organized into the following parts:

- **Main Components** – High-level orchestrators (`GenericQuestionnaire`, `AnsweredQuestionnaire`)
- **QuestionsTypes/** – Individual question input components (radio, text, table, etc.)
- **utils/** – Shared utilities for visibility logic and formula calculations
- **Supporting Components** – `QuestionRenderer`, `Stepper`

---

## Main Components

### `GenericQuestionnaire`

The primary component for rendering an interactive questionnaire form. It handles:

- Multi-section questionnaires with optional stepper navigation
- Dynamic question visibility based on conditions
- Answer state management and validation
- Formula-based calculated fields
- Draft answer restoration
- Submit and cancel flows

**Props:**

```typescript
interface GenericQuestionnaireProps {
  questionnaire: Questionnaire // GraphQL questionnaire model
  onSubmit: (answers: { [key: string]: QuestionAnswer }) => void
  onCancel?: () => void
  backLink?: string // Optional back navigation link
  enableStepper?: boolean // Enable multi-step navigation (default: false)
  questionsPerStep?: number // Questions per step (default: 3)
  img?: string // Optional header image
  initialAnswers?: { [key: string]: QuestionAnswer } // Pre-populate answers (drafts)
  isDraft?: boolean // Whether this is a draft submission
}
```

**Usage:**

```tsx
import { GenericQuestionnaire } from '@island.is/portals/my-pages/core'
;<GenericQuestionnaire
  questionnaire={questionnaireData}
  onSubmit={(answers) => submitMutation({ answers })}
  onCancel={() => navigate('/questionnaires')}
  enableStepper={true}
  questionsPerStep={5}
  initialAnswers={draftAnswers}
/>
```

**Features:**

- **Visibility Logic**: Questions and sections automatically show/hide based on `visibilityConditions` and `dependsOn` fields
- **Formula Calculations**: Questions with `formula` in `answerOptions` are automatically calculated from other answers
- **Validation**: Required fields are validated before submission
- **Progress Tracking**: Optional stepper UI shows progress through multi-section forms
- **Draft Handling**: Can pre-populate answers from saved drafts via `initialAnswers`

---

### `AnsweredQuestionnaire`

A read-only component that displays submitted questionnaire answers. Used to show historical submissions.

**Props:**

```typescript
interface AnsweredQuestionnaireProps {
  questionnaire?: QuestionnaireAnsweredQuestionnaire
}
```

**Usage:**

```tsx
import { AnsweredQuestionnaire } from '@island.is/portals/my-pages/core'
;<AnsweredQuestionnaire questionnaire={submittedQuestionnaire} />
```

Automatically formats answers including:

- Date/time values
- Multi-select lists
- Text responses

---

## Question Type Components

Located in `QuestionsTypes/`. Each component handles rendering and interaction for a specific question type.

### `Radio`

Single-select radio button group. Maps to `QuestionnaireAnswerOptionType.radio`.

**Props:**

```typescript
interface RadioProps {
  id: string
  label?: string
  options: RadioOption[] // { label, value, disabled? }[]
  value?: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  direction?: 'horizontal' | 'vertical' // default: 'vertical'
}
```

Renders large colored buttons when there are ≤2 options, standard radio buttons otherwise.

---

### `Multiple`

Multi-select checkbox group. Maps to `QuestionnaireAnswerOptionType.checkbox`.

**Props:**

```typescript
interface MultipleProps {
  id: string
  label?: string
  options: MultipleOption[] // { label, value, disabled? }[]
  value?: string[]
  onChange: (values: string[]) => void
  error?: string
  disabled?: boolean
  required?: boolean
}
```

---

### `TextInput`

Text, number, or email input. Maps to `QuestionnaireAnswerOptionType.text` and `QuestionnaireAnswerOptionType.number`.

**Props:**

```typescript
interface TextInputProps {
  id: string
  label?: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'email' // default: 'text'
  maxLength?: number
  min?: number // for number type
  max?: number // for number type
  error?: string
  disabled?: boolean
  required?: boolean
  textarea?: boolean // Multi-line text area
  rows?: number // Rows for textarea
}
```

---

### `Table`

Dynamic table input for structured data. Maps to `QuestionnaireAnswerOptionType.table`.

**Props:**

```typescript
interface TableProps {
  id: string
  label: string
  columns: QuestionnaireTableColumn[] // Column definitions with type, label, options
  value?: QuestionAnswer
  onChange: (answer: QuestionAnswer) => void
  disabled?: boolean
  error?: string
  numRows?: number // Initial rows (default: 1)
  maxRows?: number // Maximum rows (default: 10)
}
```

Supports:

- Adding/removing rows dynamically
- Text, date, and select column types
- Validation per column

---

### `Scale`

Numeric slider or scale input. Maps to `QuestionnaireAnswerOptionType.slider`.

**Props:**

```typescript
interface ScaleProps {
  id: string
  label?: string
  min: number
  max: number
  step?: number // default: 1
  value?: number
  onChange: (value: number) => void
  showLabels?: boolean // Show min/max labels
  error?: string
  disabled?: boolean
}
```

---

### `Thermometer`

Visual thermometer-style rating scale. Maps to `QuestionnaireAnswerOptionType.thermometer`.

**Props:**

```typescript
interface ThermometerProps {
  id: string
  label?: string
  options: { label: string; value: string }[]
  value?: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}
```

Renders as a vertical visual scale with clickable segments.

---

## Supporting Components

### `QuestionRenderer`

Internal component that maps a `QuestionnaireQuestion` to the appropriate question type component. Used by `GenericQuestionnaire`.

**Props:**

```typescript
interface QuestionRendererProps {
  question: QuestionnaireQuestion
  answer?: QuestionAnswer
  onAnswerChange: (answer: QuestionAnswer) => void
  disabled?: boolean
  error?: string
}
```

Handles:

- Type detection based on `question.answerOptions.type`
- Conversion between internal answer format and component props
- Date picker rendering for date types
- Progress bar rendering for slider types

---

### `Stepper`

Multi-step form navigation component. Used by `GenericQuestionnaire` when `enableStepper={true}`.

**Props:**

```typescript
interface StepperProps {
  steps: Step[] // { id, title, description?, completed?, disabled? }[]
  currentStepIndex: number
  onStepChange: (stepIndex: number) => void
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string // default: 'Next'
  previousLabel?: string // default: 'Previous'
  allowClickableSteps?: boolean // default: false
  backLink?: string
}
```

Provides:

- Visual progress indicator
- Step-by-step navigation buttons
- Optional clickable step indicators
- Progress percentage calculation

---

## Utilities

### `visibilityUtils.ts`

Contains logic for evaluating question and section visibility based on `visibilityConditions`.

**Key Functions:**

```typescript
// Check if a question should be visible based on its conditions
function isQuestionVisibleWithStructuredConditions(
  question: QuestionnaireQuestion,
  answers: { [key: string]: QuestionAnswer },
): boolean

// Check if a section should be visible
function isSectionVisible(
  section: QuestionnaireSection,
  answers: { [key: string]: QuestionAnswer },
): boolean
```

**Supported Operators:**

- `equals` / `notEquals` – Exact value comparison
- `contains` / `notContains` – Substring or array membership
- `greaterThan` / `greaterThanOrEqual` – Numeric/date comparison
- `lessThan` / `lessThanOrEqual` – Numeric/date comparison
- `isSelected` – Check if a specific option is selected
- `exists` / `notExists` – Check if question has any answer

Conditions are evaluated with AND logic by default.

---

### `calculations.ts`

Handles formula evaluation for calculated fields.

**Key Function:**

```typescript
// Evaluate a formula string against current answers
function calculateFormula(
  formula: string,
  answers: { [key: string]: QuestionAnswer },
): number | null
```

**Supported Operations:**

- Arithmetic: `+`, `-`, `*`, `/`
- Functions: `min()`, `max()`, `sum()`, `round()`, `abs()`, `floor()`, `ceil()`
- Date operations: `datediff()`, `dateadd()`, `year()`, `month()`, `day()`
- References: `@@@questionId` to reference other answers

**Example Formulas:**

```
sum(@@@Q1, @@@Q2, @@@Q3)
round((@@@height / 100) * (@@@height / 100) * @@@weight)
datediff(@@@startDate, @@@endDate, 'days')
```

---

## Data Flow

### Question Rendering Flow

1. `GenericQuestionnaire` receives `Questionnaire` from GraphQL API
2. For each section, checks `isSectionVisible()`
3. For each question in visible sections, checks `isQuestionVisibleWithStructuredConditions()`
4. Passes visible questions to `QuestionRenderer`
5. `QuestionRenderer` selects appropriate component based on `answerOptions.type`
6. User interacts with question component
7. `onChange` updates answer state in `GenericQuestionnaire`
8. Visibility conditions re-evaluate, possibly showing/hiding other questions
9. Formula fields recalculate based on new answers

### Answer Format

Answers are stored in the following structure:

```typescript
interface QuestionAnswer {
  questionId: string
  answers: Array<{
    value: string
    label?: string // For radio/checkbox/select options
  }>
  type: QuestionnaireAnswerOptionType
}
```

---

## Integration with API

These components consume data from `@island.is/api/schema`:

- **Input**: `Questionnaire` (from GraphQL query)
  - Mapped from EL/LSH APIs by backend transformers (see `libs/api/domains/questionnaires`)
- **Output**: `{ [questionId: string]: QuestionAnswer }` (for submission mutation)
  - Mapped back to EL/LSH format by backend answer mappers

The components are **provider-agnostic** – they work with questionnaires from any source (EL, LSH) as long as they conform to the `Questionnaire` GraphQL model.

---

## Testing

Multiple tests regarding visibility mapping can be fount `visibilityUtils.spec.ts`

---

## Best Practices

### When using GenericQuestionnaire:

1. **Always provide `onSubmit` handler** – Don't forget to handle the submission mutation
2. **Use `initialAnswers` for drafts** – Pre-populate from `draftAnswers` in the GraphQL query
3. **Enable stepper for long forms** – Improves UX when there are many questions
4. **Handle formula fields carefully** – Don't allow user input for calculated fields
5. **Test visibility logic thoroughly** – Complex conditions can create unexpected UX

### When creating new question types:

1. Add to `QuestionsTypes/` folder
2. Export from `index.ts`
3. Update `QuestionRenderer` to handle the new type
4. Add corresponding `AnswerOptionType` mapping in backend
5. Document props and usage in this README
