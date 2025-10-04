<!-- Generated with AI -->

# Questionnaire Transform Scripts

This directory contains transform scripts for converting questionnaire JSON files to the exact GraphQL model format used in the questionnaires service.

## Scripts

### 1. LSH Transform (`transform.ts`)

Transforms LSH questionnaire JSON files to GraphQL models.

#### Features

- **Exact GraphQL Model Mapping**: Maps to the exact `Questionnaire` and `Question` models with proper TypeScript types
- **Enum Usage**: Uses proper enum values from `QuestionDisplayType` and `QuestionnairesStatusEnum`
- **Union Types**: Correctly maps to GraphQL union types for different answer types:
  - `HealthQuestionnaireAnswerRadio` for SingleSelect/Dropdown
  - `HealthQuestionnaireAnswerCheckbox` for MultiSelect
  - `HealthQuestionnaireAnswerText` for TextBox
  - `HealthQuestionnaireAnswerNumber` for NumBox
  - `HealthQuestionnaireAnswerScale` for Slider with min/max values
  - `HealthQuestionnaireAnswerThermometer` for Slider without values
  - `HealthQuestionnaireAnswerLabel` for display-only text
- **Dependency Detection**: Intelligent dependency detection for question chains
- **TypeScript Output**: Generates ready-to-use TypeScript files with proper imports

#### Usage

```bash
# Transform a JSON file to TypeScript
npx ts-node transform.ts <input-json-file> [output-ts-file]

# Example: Transform lsh_list_1.json
npx ts-node transform.ts lsh_list_1.json lsh_list_1_transformed.ts
```

### 2. EL Transform (`el_transform.ts`)

Transforms EL questionnaire JSON files (with triggers) to GraphQL models.

#### Features

- **EL JSON Format Support**: Handles the EL JSON structure with groups, items, and triggers
- **Trigger Mapping**: Maps trigger dependencies (called `dependsOn` in previous LSH format) to GraphQL format
- **Question Types**: Supports all EL question types:
  - `bool` → `HealthQuestionnaireAnswerRadio` (Já/Nei options)
  - `number` → `HealthQuestionnaireAnswerNumber` or `HealthQuestionnaireAnswerThermometer` (if displayClass="thermometer")
  - `string` → `HealthQuestionnaireAnswerText`
  - `text` → `HealthQuestionnaireAnswerLabel` (display-only)
  - `list` → `HealthQuestionnaireAnswerCheckbox`
  - `radio` → `HealthQuestionnaireAnswerRadio`
- **Visibility Conditions**: Converts trigger objects to JSON string format for visibility conditions
- **TypeScript Output**: Generates ready-to-use TypeScript files with proper imports

#### Usage

```bash
# Transform an EL JSON file to TypeScript
npx ts-node el_transform.ts <input-json-file> [output-ts-file]

# Example: Transform el_list_1.json
npx ts-node el_transform.ts el_list_1.json el_list_1_transformed.ts
```

#### EL Transform Results for `el_list_1.json`

- ✅ **47 questions** transformed successfully
- ✅ **2 questions** with trigger dependencies
- ✅ **Question types generated**:
  - Radio (bool): 40 questions
  - Thermometer: 1 question
  - Label (text): 2 questions
  - Text (string): 2 questions
  - Checkbox (list): 2 questions

````

### Programmatic Usage

```typescript
import { transformQuestionnaire, transformJsonFile } from './transform'

// Transform data object directly
const transformedData = transformQuestionnaire(originalJsonData)

// Transform JSON file
transformJsonFile('./input.json', './output.ts')
````

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
