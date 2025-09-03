# Questionnaire System Guide

A comprehensive, dynamic questionnaire system for Island.is with conditional visibility and LSH data support.

## Quick Start

```tsx
import { GenericQuestionnaire } from '../components/Questionnaries'
import { completeLSHQuestionnaire } from './mockJsonLSH_complete_fixed'
;<GenericQuestionnaire
  questionnaire={completeLSHQuestionnaire}
  onSubmit={(answers) => console.log(answers)}
  enableStepper={true}
  questionsPerStep={3}
/>
```

## Supported Question Types

### Radio Buttons (Single Selection)

```tsx
{
  __typename: 'HealthQuestionnaireAnswerRadio',
  id: 'question-id',
  label: 'Do you agree?',
  answerOptions: [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' }
  ]
}
```

### Multiple Choice (Checkboxes)

```tsx
{
  __typename: 'HealthQuestionnaireAnswerMultiple',
  id: 'symptoms',
  label: 'Select all symptoms:',
  answerOptions: [
    { id: 'fever', label: 'Fever' },
    { id: 'cough', label: 'Cough' }
  ]
}
```

### Text Input

```tsx
{
  __typename: 'HealthQuestionnaireAnswerText', // or TextArea for multiline
  id: 'name',
  label: 'Your name'
}
```

### Number Input

```tsx
{
  __typename: 'HealthQuestionnaireAnswerNumber',
  id: 'height',
  label: 'Height',
  min: 50,
  max: 250,
  unit: 'cm'
}
```

## Conditional Visibility

Questions can show/hide based on other answers:

```tsx
{
  id: 'cancer-type',
  label: 'What type of cancer?',
  dependsOn: ['has-cancer'],
  visibilityCondition: "isSelected('yes','@@@has-cancer')"
}
```

### Supported Conditions

- **Radio/Single Select**: `isSelected('optionId','@@@questionId')`
- **Checkboxes**: `isSelected('optionId',@@@questionId)`
- **Equality**: `'value' == '@@@questionId'`

### How It Works

1. **Dependencies**: Questions list which other questions they depend on
2. **Conditions**: Boolean expressions determine visibility
3. **Real-time**: Questions appear/disappear as users answer
4. **Value Matching**: Uses option IDs (not labels) for matching

## LSH Medical Questionnaire

Complete healthcare questionnaire with **120 questions** across **21 medical sections**:

- **60 questions** have conditional visibility
- **42 fixed visibility conditions** (labels → option IDs)
- **Medical specialties**: Mental health, cardiology, oncology, etc.

### Using LSH Data

```tsx
import {
  completeLSHQuestionnaire,
  lshDataStats,
} from './mockJsonLSH_complete_fixed'

// Full questionnaire
;<GenericQuestionnaire questionnaire={completeLSHQuestionnaire} />

// Stats available
console.log(lshDataStats.totalQuestions) // 120
console.log(lshDataStats.questionsWithDependencies) // 60
```

## Component Props

### GenericQuestionnaire

| Prop                | Type                  | Default    | Description        |
| ------------------- | --------------------- | ---------- | ------------------ |
| `questionnaire`     | `HealthQuestionnaire` | Required   | Question data      |
| `onSubmit`          | `(answers) => void`   | Required   | Form submission    |
| `onCancel?`         | `() => void`          | Optional   | Cancel handler     |
| `enableStepper?`    | `boolean`             | `false`    | Multi-step mode    |
| `questionsPerStep?` | `number`              | `3`        | Questions per step |
| `submitLabel?`      | `string`              | `'Submit'` | Submit button text |
| `cancelLabel?`      | `string`              | `'Cancel'` | Cancel button text |

## Answer Format

All answers follow this structure:

```tsx
{
  questionId: string
  value: string | string[] | number
}
```

### Examples

```tsx
// Radio button
{ questionId: 'gender', value: 'male' }

// Multiple choice
{ questionId: 'symptoms', value: ['fever', 'cough'] }

// Text input
{ questionId: 'name', value: 'John Doe' }

// Number input
{ questionId: 'age', value: 25 }
```

## Data Conversion

- `SingleSelect` → `HealthQuestionnaireAnswerRadio`
- `MultiSelect` → `HealthQuestionnaireAnswerMultiple`
- `String` → `HealthQuestionnaireAnswerText/TextArea`
- `Number` → `HealthQuestionnaireAnswerNumber`

### Option ID Generation

Labels are converted to safe IDs:

- `"Já"` → `"j"`
- `"Nei"` → `"nei"`
- `"Annað"` → `"anna"`

## Troubleshooting

### Conditional Visibility Not Working

1. **Check option IDs**: Conditions must use option IDs, not labels
2. **Verify format**: Use `isSelected('optionId','@@@questionId')`
3. **Debug**: Add `console.log` in `visibilityUtils.ts`

### Common Issues

- **Wrong format**: `'Já'` vs `'j'` (use option ID)
- **Missing quotes**: `@@@questionId` vs `'@@@questionId'`
- **Case sensitivity**: IDs are lowercase with dashes
