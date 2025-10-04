import * as fs from 'fs'
import {
  QuestionDisplayType,
  Question,
  AnswerOption,
  AnswerOptionType,
} from '../../models/question.model'
import {
  Questionnaire,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../../models/questionnaires.model'

// THIS SCRIPT IS FOR TRANSFORMING EL_LIST JSON FILES

// Type definitions for the EL JSON structure
interface ElTrigger {
  triggerId: string
  targetId: string
  visible: boolean
  contains?: string[]
  type: string
}

interface ElItem {
  id: string
  label: string
  type: string
  htmlLabel?: string
  required?: boolean
  min?: number
  max?: number
  decimals?: boolean
  minDescription?: string
  maxDescription?: string
  displayClass?: string
  multiline?: boolean
  multiselect?: boolean
  minSelections?: number
  maxSelections?: number
  options?: Array<{
    id: string
    label: string
  }>
  values?: Array<{
    id: string
    label: string
  }>
}

interface ElGroup {
  title?: string
  items: ElItem[]
}

interface ElData {
  questionnaireId: string
  title: string
  numRepliesAllowed: number
  daysBetweenReplies: number
  canSubmit: boolean
  submissions: unknown[]
  hasDraft: boolean
  groups: ElGroup[]
  triggers: Record<string, ElTrigger[]>
  replies: unknown[]
}

// Map EL question type to the correct answer type
const createAnswerType = (elItem: ElItem): Record<string, unknown> => {
  const baseProps = {
    id: `${elItem.id}_type`,
    sublabel: elItem.htmlLabel || undefined,
    display: mapDisplayType(elItem.required || false),
  }

  switch (elItem.type) {
    case 'radio':
      return {
        type: AnswerOptionType.radio,
        ...baseProps,
        options: elItem.options?.map((option) => option.label) || [],
      }
    case 'checkbox':
      return {
        type: AnswerOptionType.checkbox,
        ...baseProps,
        options: elItem.options?.map((option) => option.label) || [],
      }
    case 'string':
      return {
        type: AnswerOptionType.text,
        ...baseProps,
        placeholder: undefined,
        maxLength: undefined,
        multiline: elItem.multiline || false,
      }
    case 'text':
      return {
        type: AnswerOptionType.label,
        ...baseProps,
      }
    case 'number':
      if (elItem.displayClass === 'thermometer') {
        return {
          type: AnswerOptionType.thermometer,
          ...baseProps,
          maxLabel: elItem.maxDescription || 'Max',
          minLabel: elItem.minDescription || 'Min',
          minValue: elItem.min || 0,
          maxValue: elItem.max || 10,
        }
      } else {
        return {
          type: AnswerOptionType.number,
          ...baseProps,
          placeholder: undefined,
          min: elItem.min || undefined,
          max: elItem.max || undefined,
        }
      }
    case 'bool':
      return {
        type: AnswerOptionType.radio,
        ...baseProps,
        options: ['Já', 'Nei'],
      }
    case 'list': {
      const listOptions = elItem.values || elItem.options || []
      if (elItem.multiselect) {
        return {
          type: AnswerOptionType.checkbox,
          ...baseProps,
          options: listOptions.map((option) => option.label),
        }
      } else {
        return {
          type: AnswerOptionType.radio,
          ...baseProps,
          options: listOptions.map((option) => option.label),
        }
      }
    }
    default:
      return {
        type: AnswerOptionType.text,
        ...baseProps,
        placeholder: undefined,
        maxLength: undefined,
      }
  }
}

const mapDisplayType = (required: boolean): QuestionDisplayType => {
  return required ? QuestionDisplayType.required : QuestionDisplayType.optional
}

// Find an item by its ID across all groups
const findItemById = (elData: ElData, itemId: string): ElItem | undefined => {
  for (const group of elData.groups) {
    for (const item of group.items) {
      if (item.id === itemId) {
        return item
      }
    }
  }
  return undefined
}

// Convert trigger contains IDs to actual option labels
const mapContainsToLabels = (
  elData: ElData,
  triggerId: string,
  contains: string[],
): string[] => {
  const triggerItem = findItemById(elData, triggerId)
  if (!triggerItem || (!triggerItem.options && !triggerItem.values)) {
    return contains // Return original if no mapping possible
  }

  // Use 'values' for list type or 'options' for other types
  const options = triggerItem.values || triggerItem.options || []

  return contains.map((containsId) => {
    const option = options.find((opt) => opt.id === containsId)
    return option ? option.label : containsId // Return label if found, otherwise original ID
  })
}

// Analyze triggers (dependencies) for a question
const analyzeTriggers = (
  elData: ElData,
  currentItemId: string,
): { dependsOn?: string[]; visibilityCondition?: string } => {
  // Find triggers that target this question
  const relevantTriggers: ElTrigger[] = []

  for (const [_triggerId, triggerList] of Object.entries(elData.triggers)) {
    for (const trigger of triggerList) {
      if (trigger.targetId === currentItemId) {
        relevantTriggers.push(trigger)
      }
    }
  }

  // Find the trigger with the most specific visibility condition (has contains array)
  const visibilityTrigger =
    relevantTriggers.find(
      (t) => t.visible && t.contains && t.contains.length > 0,
    ) ||
    relevantTriggers.find((t) => t.visible) ||
    relevantTriggers[0]

  if (visibilityTrigger) {
    // Map contains IDs to actual option labels
    const containsLabels = visibilityTrigger.contains
      ? mapContainsToLabels(
          elData,
          visibilityTrigger.triggerId,
          visibilityTrigger.contains,
        )
      : []

    // This question depends on the trigger question
    // Convert to unified format
    const condition = {
      questionId: visibilityTrigger.triggerId,
      operator: (containsLabels.length > 1 ? 'contains' : 'equals') as
        | 'contains'
        | 'equals',
      value: containsLabels.length === 1 ? containsLabels[0] : containsLabels,
      visible: visibilityTrigger.visible,
    }

    const visibilityCondition = JSON.stringify(condition)

    return {
      dependsOn: [visibilityTrigger.triggerId],
      visibilityCondition,
    }
  }

  return {}
}

const transformItem = (elItem: ElItem, elData: ElData): Question => {
  // Create the answer type based on the item type
  const answerType = createAnswerType(elItem)

  // Create the flattened answer option (no nested type object)
  const answerOption: AnswerOption = {
    id: `${elItem.id}_answer`,
    ...answerType,
  } as AnswerOption

  // Analyze triggers (dependencies) for this item
  const dependencies = analyzeTriggers(elData, elItem.id)

  return {
    id: elItem.id,
    label: elItem.label,
    sublabel: elItem.htmlLabel || undefined,
    display: mapDisplayType(elItem.required || false),
    answerOptions: answerOption,
    dependsOn: dependencies.dependsOn,
    visibilityCondition: dependencies.visibilityCondition,
  }
}

const transformData = (elData: ElData): QuestionnairesList => {
  const allQuestions: Question[] = []

  // Transform all items from all groups
  elData.groups.forEach((group) => {
    group.items.forEach((item) => {
      allQuestions.push(transformItem(item, elData))
    })
  })

  const questionnaire: Questionnaire = {
    id: elData.questionnaireId,
    title: elData.title,
    description: '',
    sentDate: new Date().toISOString(),
    status: QuestionnairesStatusEnum.notAnswered,
    organization: 'EL',
    questions: allQuestions,
  }

  return {
    questionnaires: [questionnaire],
  }
}

// Generic function to transform any EL questionnaire data
export const transformElQuestionnaire = (
  elData: ElData,
): QuestionnairesList => {
  return transformData(elData)
}

// Function to transform an EL JSON file and save as TypeScript
export const transformElJsonFile = (
  inputFilePath: string,
  outputFilePath?: string,
): void => {
  try {
    // Read the JSON file
    const jsonContent = fs.readFileSync(inputFilePath, 'utf8')
    const elData = JSON.parse(jsonContent) as ElData

    // Transform the data
    const transformedData = transformData(elData)

    // Generate TypeScript content
    const tsContent = generateTypeScriptContent(transformedData)

    // Determine output file path
    const outputPath =
      outputFilePath || inputFilePath.replace('.json', '_transformed.ts')

    // Write the TypeScript file
    fs.writeFileSync(outputPath, tsContent)

    console.log('EL Transformation completed successfully!')
    console.log(`Source file: ${inputFilePath}`)
    console.log(`Transformed file: ${outputPath}`)
    if (transformedData.questionnaires?.[0]) {
      console.log(
        `Number of questions transformed: ${
          transformedData.questionnaires[0].questions?.length || 0
        }`,
      )

      // Count questions with dependencies (triggers)
      const questionsWithDeps =
        transformedData.questionnaires[0].questions?.filter(
          (q) => q.dependsOn,
        ) || []
      console.log(`Questions with triggers: ${questionsWithDeps.length}`)

      // Count triggers
      const totalTriggers = Object.values(elData.triggers).reduce(
        (sum, triggerList) => sum + triggerList.length,
        0,
      )
      console.log(`Total triggers defined: ${totalTriggers}`)
    }
  } catch (error) {
    console.error('Error during EL transformation:', error)
    throw error
  }
}

// Generate TypeScript file content
const generateTypeScriptContent = (data: QuestionnairesList): string => {
  let jsonString = JSON.stringify(data, null, 2)

  // Replace enum references with proper TypeScript enum access
  jsonString = jsonString.replace(
    /"QuestionDisplayType\.(\w+)"/g,
    'QuestionDisplayType.$1',
  )
  jsonString = jsonString.replace(
    /"QuestionnairesStatusEnum\.(\w+)"/g,
    'QuestionnairesStatusEnum.$1',
  )
  jsonString = jsonString.replace(
    /"AnswerOptionType\.(\w+)"/g,
    'AnswerOptionType.$1',
  )

  // Replace specific enum values more carefully to avoid replacing property names
  jsonString = jsonString.replace(/"type":\s*"([^"]+)"/g, (match, value) => {
    // Map full GraphQL type names to enum keys
    const typeMap: { [key: string]: string } = {
      HealthQuestionnaireAnswerText: 'text',
      HealthQuestionnaireAnswerRadio: 'radio',
      HealthQuestionnaireAnswerCheckbox: 'checkbox',
      HealthQuestionnaireAnswerThermometer: 'thermometer',
      HealthQuestionnaireAnswerNumber: 'number',
      HealthQuestionnaireAnswerScale: 'scale',
      HealthQuestionnaireAnswerLabel: 'label',
    }

    if (typeMap[value]) {
      return `"type": AnswerOptionType.${typeMap[value]}`
    }
    return match
  })

  // Replace other enum values
  jsonString = jsonString.replace(/"(\w+)"/g, (match, enumValue) => {
    // Replace specific enum values
    if (['required', 'optional', 'hidden'].includes(enumValue)) {
      return `QuestionDisplayType.${enumValue}`
    }
    if (['answered', 'notAnswered', 'expired'].includes(enumValue)) {
      return `QuestionnairesStatusEnum.${enumValue}`
    }
    return match
  })

  return `import { QuestionDisplayType, AnswerOptionType } from '../models/question.model'
import { QuestionnairesStatusEnum } from '../models/questionnaires.model'

export const data = ${jsonString}
`
}

// CLI-style interface for transforming EL questionnaires
const transformElQuestionnaireFromArgs = (): void => {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log(
      'Usage: npx ts-node el_transform.ts <input-json-file> [output-ts-file]',
    )
    console.log(
      'Example: npx ts-node el_transform.ts ./el_list_1.json ./el_list_1_transformed.ts',
    )
    return
  }

  const inputFile = args[0]
  const outputFile = args[1]

  if (!fs.existsSync(inputFile)) {
    console.error(`Input file does not exist: ${inputFile}`)
    return
  }

  try {
    transformElJsonFile(inputFile, outputFile)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Execute the transformation when script is run directly
if (require.main === module) {
  transformElQuestionnaireFromArgs()
}
