<!-- Generated with AI -->

# Questionnaire Transform Script

This script transforms LSH questionnaire JSON files to the exact GraphQL model format used in the questionnaires service.

## Features

- **Exact GraphQL Model Mapping**: Maps to the exact `Questionnaire` and `Question` models with proper TypeScript types
- **Enum Usage**: Uses proper enum values from `QuestionDisplayType` and `QuestionnairesStatusEnum`
- **Union Types**: Correctly maps to GraphQL union types for different answer types:
  - `HealthQuestionnaireAnswerRadio` for SingleSelect/Dropdown
  - `HealthQuestionnaireAnswerCheckbox` for MultiSelect
  - `HealthQuestionnaireAnswerText` for TextBox
  - `HealthQuestionnaireAnswerNumber` for NumBox
  - `HealthQuestionnaireAnswerScale` for Slider with min/max values
  - `HealthQuestionnaireAnswerThermometer` for Slider without values
- **Dependency Detection**: Intelligent dependency detection for question chains
- **TypeScript Output**: Generates ready-to-use TypeScript files with proper imports

## Usage

### Command Line

```bash
# Transform a JSON file to TypeScript
npx ts-node transform.ts <input-json-file> [output-ts-file]

# Example: Transform lsh_list_1.json
npx ts-node transform.ts lsh_list_1.json lsh_list_1_transformed.ts
```

### Programmatic Usage

```typescript
import { transformQuestionnaire, transformJsonFile } from './transform'

// Transform data object directly
const transformedData = transformQuestionnaire(originalJsonData)

// Transform JSON file
transformJsonFile('./input.json', './output.ts')
```

## Input Format

The script expects JSON files with the following structure:

```json
{
  "Sections": [
    {
      "Questions": [
        {
          "Question": "Question text",
          "EntryID": "unique_id",
          "Type": "SingleSelect|MultiSelect|TextBox|NumBox|Slider|Dropdown",
          "Required": true|false,
          "Visible": "1"|"0",
          "Options": [
            {"Label": "Option 1", "Value": "Option 1"},
            {"Label": "Option 2", "Value": "Option 2"}
          ],
          "Description": "Optional description",
          "Instructions": "Optional instructions",
          "MaxLength": 100,
          "MinValue": 0,
          "MaxValue": 10,
          "DependsOn": [],
          ...
        }
      ],
      "Caption": "Section name"
    }
  ],
  "Header": "Questionnaire title",
  "Description": "Questionnaire description",
  "GUID": "questionnaire-id",
  "FormID": "form-id"
}
```

## Output Format

The script generates TypeScript files that can be directly imported and used in the questionnaires service:

```typescript
import { QuestionDisplayType } from '../models/question.model'
import { QuestionnairesStatusEnum } from '../models/questionnaires.model'

export const data = {
  questionnaires: [
    {
      id: 'questionnaire-id',
      title: 'Questionnaire title',
      description: 'Description',
      sentDate: '2025-09-08T12:49:03.139Z',
      status: QuestionnairesStatusEnum.notAnswered,
      organization: 'Landspítali',
      questions: [
        {
          id: 'question-id',
          label: 'Question text',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'answer-id',
            label: 'Question text',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'type-id',
              label: 'Question text',
              display: QuestionDisplayType.optional,
              options: ['Option 1', 'Option 2'],
            },
          },
        },
      ],
    },
  ],
}
```

## Type Mappings

| Original Type            | GraphQL Type                         |
| ------------------------ | ------------------------------------ |
| SingleSelect             | HealthQuestionnaireAnswerRadio       |
| MultiSelect              | HealthQuestionnaireAnswerCheckbox    |
| TextBox                  | HealthQuestionnaireAnswerText        |
| NumBox                   | HealthQuestionnaireAnswerNumber      |
| Slider (with min/max)    | HealthQuestionnaireAnswerScale       |
| Slider (without min/max) | HealthQuestionnaireAnswerThermometer |
| Dropdown                 | HealthQuestionnaireAnswerRadio       |

## Dependency Detection

The script includes intelligent dependency detection:

- **"What else?" patterns**: Questions asking for additional details
- **Yes/No follow-ups**: Questions following yes/no options
- **Explicit dependencies**: Uses original `DependsOn` data when available

## Customization

You can customize dependency patterns by modifying `defaultDependencyConfig`:

```typescript
export const customConfig = {
  ...defaultDependencyConfig,
  yesPatterns: [/^já$/i, /^yes$/i, /^samtykki$/i],
  noPatterns: [/^nei$/i, /^no$/i, /^afþakka$/i],
}
```

## Integration with questionnaires.service.ts

The generated files can be directly imported in the questionnaires service:

```typescript
import { data as lshList1 } from '../mockdata/lsh_list_1_transformed'

// Use in service
const questionnaire = lshList1.questionnaires[0]
```

This ensures type safety and compatibility with the GraphQL resolvers.
