# Questionnaires Component Library

This folder contains React components for rendering dynamic questionnaires in My Pages portal. The components consume questionnaire data from the GraphQL API (which is transformed from EL and LSH APIs) and provide an interactive form experience with validation, visibility logic, and formula calculations.

## Architecture

The library is organized into the following parts:

- **Main Components** – High-level orchestrators (`GenericQuestionnaire`, `AnsweredQuestionnaire`)
- **QuestionsTypes/** – Individual question input components (radio, text, table, etc.)
- **utils/** – Shared utilities for visibility logic and formula calculations
- **Supporting Components** – `QuestionRenderer`

---

## Main Components

### `GenericQuestionnaire`

The primary component for rendering an interactive questionnaire form. It handles:

- Dynamic question visibility based on conditions
- Answer state management and validation
- Formula-based calculated fields
- Draft answer restoration
- Submit and cancel flows

**Props:**

```typescript
interface GenericQuestionnaireProps {
  questionnaire: Questionnaire // GraphQL questionnaire model
  onSubmit: (
    answers: { [key: string]: QuestionAnswer },
    asDraft?: boolean,
  ) => void
  onCancel?: () => void
  img?: string // Optional header image
  initialAnswers?: { [key: string]: QuestionAnswer } // Pre-populate answers (drafts)
}
```

**Usage:**

```tsx
import { GenericQuestionnaire } from '@island.is/portals/my-pages/core'
;<GenericQuestionnaire
  questionnaire={questionnaireData}
  onSubmit={(answers) => submitMutation({ answers })}
  onCancel={() => navigate('/questionnaires')}
  initialAnswers={draftAnswers}
/>
```

**Features:**

- **Visibility Logic**: Questions and sections automatically show/hide based on `visibilityConditions` and `dependsOn` fields
- **Formula Calculations**: Questions with `formula` in `answerOptions` are automatically calculated from other answers
- **Validation**: Required fields are validated before submission
- **Draft Handling**: Can pre-populate answers from saved drafts via `initialAnswers`

---

### `Answered`

A read-only component that displays submitted questionnaire answers. Used to show historical submissions.

**Props:**

```typescript
interface AnsweredProps {
  answers?: QuestionAnswer[]
}
```

**Usage:**

```tsx
import { Answered } from '@island.is/portals/my-pages/core'
;<Answered answers={questionAnswers} />
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
  options: MultipleOption[] // { label, value, disabled? }[]
  value?: string[]
  onChange: (values: string[]) => void
  error?: string
  disabled?: boolean
  required?: boolean
  direction?: 'horizontal' | 'vertical' // default: 'vertical'
  maxSelections?: number // Limit number of selections
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
  type?: 'text' | 'number' | 'decimal' // default: 'text'
  maxLength?: string // Note: string not number
  min?: string // for number/decimal type (string not number)
  max?: string // for number/decimal type (string not number)
  step?: number // for decimal type
  error?: string
  disabled?: boolean
  required?: boolean
  multiline?: boolean // Multi-line text area
  rows?: number // Rows for textarea (default: 4)
  backgroundColor?: 'white' | 'blue' // default: 'blue'
}
```

---

### `Table`

Dynamic table input for structured data. Maps to `QuestionnaireAnswerOptionType.table`.

**Props:**

```typescript
interface TableProps {
  id: string
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
  min: string | number
  max: string | number
  step?: number // default: 1
  value?: string | null
  onChange: (value: string) => void
  showLabels?: boolean // Show min/max labels (default: true)
  minLabel?: string
  maxLabel?: string
  error?: string
  disabled?: boolean
  required?: boolean
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
  min: string
  max: string
  value?: string | null
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  minLabel?: string
  maxLabel?: string
  step?: number // default: 1
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

Provides:

- Visual progress indicator
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

Multiple tests regarding visibility mapping can be found `visibilityUtils.spec.ts`

---

## Best Practices

### When using GenericQuestionnaire:

1. **Always provide `onSubmit` handler** – Don't forget to handle the submission mutation
2. **Use `initialAnswers` for drafts** – Pre-populate from `draftAnswers` in the GraphQL query
3. **Handle formula fields carefully** – Don't allow user input for calculated fields
4. **Test visibility logic thoroughly** – Complex conditions can create unexpected UX

### When creating new question types:

1. Add to `QuestionsTypes/` folder
2. Export from `index.ts`
3. Update `QuestionRenderer` to handle the new type
4. Add corresponding `AnswerOptionType` mapping in backend
5. Document props and usage in this README
