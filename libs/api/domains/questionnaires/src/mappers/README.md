# Questionnaire Transform Mappers

This directory contains TypeScript mapper functions that transform different questionnaire formats into the internal questionnaire model structure. These mappers replace the previous CLI-style transform scripts.

## Available Mappers

### EL (Embætti landlæknis) Questionnaire Mapper

Transforms questionnaires from the Embætti landlæknis (Directorate of Health) format.

```typescript
import {
  transformElQuestionnaire,
  transformElQuestionnaireFromJson,
} from '@island.is/api/domains/questionnaires'

// From parsed JSON object
const transformedData = transformElQuestionnaire(elQuestionnaireData)

// From JSON string
const transformedData = transformElQuestionnaireFromJson(jsonString)
```

**Input Format:**

```typescript
interface ElData {
  questionnaireId: string
  title: string
  groups: ElGroup[]
  triggers: Record<string, ElTrigger[]>
  // ... other properties
}
```

**Features:**

- Maps EL question types (radio, checkbox, string, number, bool, list, text)
- Handles thermometer display for number questions
- Processes trigger-based dependencies
- Converts visibility conditions to unified format

### LSH (Landspítali) Questionnaire Mapper

Transforms questionnaires from the Landspítali hospital format.

```typescript
import {
  transformLshQuestionnaire,
  transformLshQuestionnaireFromJson,
} from '@island.is/api/domains/questionnaires'

// From parsed JSON object
const transformedData = transformLshQuestionnaire(lshQuestionnaireData)

// From JSON string
const transformedData = transformLshQuestionnaireFromJson(jsonString)

// With custom dependency configuration
const transformedData = transformLshQuestionnaireWithConfig(
  lshQuestionnaireData,
  {
    yesPatterns: [/^já$/i, /^yes$/i],
    noPatterns: [/^nei$/i, /^no$/i],
  },
)
```

**Input Format:**

```typescript
interface OriginalData {
  Header: string
  Description: string
  GUID: string
  Sections: OriginalSection[]
  // ... other properties
}
```

**Features:**

- Maps LSH question types (List, YesNo, Number, Date, Text)
- Intelligent dependency detection based on patterns
- Supports "What else?" follow-up questions
- Handles Yes/No question dependencies

## Usage in Service

Here's how to use these mappers in your service:

```typescript
import { Injectable } from '@nestjs/common'
import { transformElQuestionnaire, transformLshQuestionnaire } from '../mappers'

@Injectable()
export class QuestionnairesService {
  async processElQuestionnaire(rawData: any): Promise<QuestionnairesList> {
    return transformElQuestionnaire(rawData)
  }

  async processLshQuestionnaire(rawData: any): Promise<QuestionnairesList> {
    return transformLshQuestionnaire(rawData)
  }

  async processFromJsonFile(
    filePath: string,
    format: 'el' | 'lsh',
  ): Promise<QuestionnairesList> {
    const fs = await import('fs')
    const jsonContent = fs.readFileSync(filePath, 'utf8')

    if (format === 'el') {
      return transformElQuestionnaireFromJson(jsonContent)
    } else {
      return transformLshQuestionnaireFromJson(jsonContent)
    }
  }
}
```

## Migration from Transform Scripts

The previous transform scripts have been converted to callable functions:

### Before (CLI Script):

```bash
npx ts-node el_transform.ts ./input.json ./output.ts
npx ts-node transform.ts ./input.json ./output.ts
```

### After (Function Call):

```typescript
// EL format
const result = transformElQuestionnaireFromJson(jsonString)

// LSH format
const result = transformLshQuestionnaireFromJson(jsonString)
```

## Output Format

All mappers return data in the same internal format:

```typescript
interface QuestionnairesList {
  questionnaires: Questionnaire[]
}

interface Questionnaire {
  id: string
  title: string
  description?: string
  sentDate: string
  status: QuestionnairesStatusEnum
  organization?: string
  sections?: QuestionnaireSection[]
}
```

## Features

### Dependency Detection

- **Pattern-based**: Automatically detects dependencies based on question patterns
- **Explicit**: Uses existing dependency data when available
- **Unified format**: Converts all dependencies to consistent JSON format

### Question Type Mapping

- Maps various input question types to internal `AnswerOptionType` enum
- Preserves question metadata (labels, descriptions, validation rules)
- Handles special cases like thermometer scales and multi-select options

### Error Handling

- Graceful fallbacks for unknown question types
- Preserves original data when transformation isn't possible
- Validates required fields before transformation
