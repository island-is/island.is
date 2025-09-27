# Health Questionnaire GraphQL Models

This library provides GraphQL models for health questionnaires that support complex query structures with union types and nested conditional questions.

## Overview

The models support a flexible questionnaire system where:

- Questions can have different answer types (thermometer, text, radio, etc.)
- Answer options can contain extra questions (nested/conditional questions)
- Union types allow for type-specific fields like `maxLabel` and `minLabel` for thermometer questions

## Query Structure Supported

```graphql
query GetHealthQuestions($questionnaireId: String!) {
  healthQuestions(questionnaireId: $questionnaireId) {
    __typename
    id
    label
    sublabel
    display
    etc
    answerOptions {
      id
      value {
        extraQuestions {
          __typename
          id
          label
          sublabel
          display
          ... on HealthQuestionnaireAnswerThermometer {
            maxLabel
            minLabel
          }
          ... on HealthQuestionnaireAnswerText {
            placeholder
            maxLength
          }
          ... on HealthQuestionnaireAnswerRadio {
            options
          }
        }
      }
      label
      type
    }
  }
}
```

## Model Structure

### Core Types

1. **Question**: Main question type with basic fields and answer options
2. **AnswerOption**: Individual answer choice with optional nested questions
3. **AnswerOptionValue**: Container for extra questions triggered by selecting an option

### Union Types

**HealthQuestionnaireAnswerUnion** supports multiple answer types:

- `HealthQuestionnaireAnswerThermometer`: For pain scales, rating scales
- `HealthQuestionnaireAnswerText`: For text input questions
- `HealthQuestionnaireAnswerRadio`: For single-choice questions
- `HealthQuestionnaireAnswerNumber`: For number input questions
- `HealthQuestionnaireAnswerCheckbox`: For multi-choice questions

### Enums

- `QuestionnairesStatusEnum`: answered, unanswered, expired
- `QuestionnaireQuestionDisplayType`: required, optional, hidden
- `QuestionnaireAnswerOptionType`: text, radio, checkbox, select, thermometer

## Usage Examples

### Creating a Thermometer Question

```typescript
const thermometerQuestion: HealthQuestionnaireAnswerThermometer = {
  __typename: 'HealthQuestionnaireAnswerThermometer',
  id: 'pain-scale-1',
  label: 'Rate your pain level',
  sublabel: 'Scale from 0-10',
  display: QuestionDisplayType.required,
  maxLabel: 'Worst pain imaginable',
  minLabel: 'No pain at all',
}
```

### Creating a Question with Conditional Logic

```typescript
const mainQuestion: Question = {
  __typename: 'Question',
  id: 'has-symptoms',
  label: 'Do you have any symptoms?',
  display: QuestionDisplayType.required,
  answerOptions: [
    {
      id: 'yes-symptoms',
      label: 'Yes',
      type: AnswerOptionType.radio,
      value: {
        extraQuestions: [thermometerQuestion], // Shown if "Yes" selected
      },
    },
    {
      id: 'no-symptoms',
      label: 'No',
      type: AnswerOptionType.radio,
      // No extraQuestions - nothing shown if "No" selected
    },
  ],
}
```

## Integration

Import the models in your resolver:

```typescript
import {
  Question,
  HealthQuestionnaireAnswerUnion,
  HealthQuestionnaireAnswerThermometer,
} from '@island.is/api/domains/questionnaires'
```

## Running unit tests

Run `nx test questionnaires` to execute the unit tests via [Jest](https://jestjs.io).
