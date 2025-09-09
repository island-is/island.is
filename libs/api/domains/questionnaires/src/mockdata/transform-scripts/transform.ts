import * as fs from 'fs'
import {
  QuestionDisplayType,
  Question,
  AnswerOption,
} from '../../models/question.model'
import {
  Questionnaire,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../../models/questionnaires.model'

// THIS SCRIPT IS PARTIALLY GENERATED WITH AI

// Type definitions for the original JSON structure
interface OriginalOption {
  Label: string
  Value: string
}

interface OriginalQuestion {
  Options?: OriginalOption[]
  Question: string
  Description: string | null
  EntryID: string
  Type: string
  MaxLength: number | null
  Required: boolean
  MinValue: number | null
  MaxValue: number | null
  Instructions: string
  Visible: string
  DependsOn: unknown[]
  Dependants: unknown[]
  Formula: string | null
  PostLabel: string | null
  Translations: string
  ShowToPatient: string
  Slider: unknown
  SendForCalculation: string
  HideTime: unknown
  MonthYear: unknown
  ShowTime: unknown
}

interface OriginalSection {
  Questions: OriginalQuestion[]
  Caption: string
}

interface OriginalData {
  Sections: OriginalSection[]
  Header: string
  Description: string
  FormID: string
  GUID: string
  AvailableTranslations: string
  Translations: string
}

// Configuration for dependency patterns
interface DependencyConfig {
  whatElsePatterns: RegExp[]
  otherPatterns: RegExp[]
  yesPatterns: RegExp[]
  noPatterns: RegExp[]
  followUpPatterns: RegExp[]
}

// Default configuration (can be customized for different languages/questionnaires)
export const defaultDependencyConfig: DependencyConfig = {
  whatElsePatterns: [
    /hvað annað/i,
    /what else/i,
    /hvað other/i,
    /specify other/i,
    /tilgreindu annað/i,
    /other.*specify/i,
    /please.*specify/i,
  ],
  otherPatterns: [
    /^annað$/i,
    /^other$/i,
    /^annad$/i,
    /^önnur$/i,
    /^anna$/i,
    /^other.*$/i,
  ],
  yesPatterns: [/^já$/i, /^yes$/i, /^j$/i, /^y$/i],
  noPatterns: [/^nei$/i, /^no$/i, /^n$/i],
  followUpPatterns: [
    /fjöldi/i, // "number of"
    /hversu/i, // "how many/much"
    /fæðingarmáti/i, // "birth method"
    /tegund/i, // "type"
    /tíðni/i, // "frequency"
    /hvaða/i, // "which"
    /útskýrðu/i, // "explain"
    /lýstu/i, // "describe"
  ],
}

// Map original question type to the correct answer type
const createAnswerType = (
  originalQuestion: OriginalQuestion,
): Record<string, unknown> => {
  const baseProps = {
    id: `${originalQuestion.EntryID}_type`,
    label: originalQuestion.Question,
    sublabel: originalQuestion.Description || undefined,
    display: mapDisplayType(
      originalQuestion.Required,
      originalQuestion.Visible,
    ),
  }

  switch (originalQuestion.Type) {
    case 'SingleSelect':
      return {
        __typename: 'HealthQuestionnaireAnswerRadio',
        ...baseProps,
        options: originalQuestion.Options?.map((option) => option.Label) || [],
      }
    case 'MultiSelect':
      return {
        __typename: 'HealthQuestionnaireAnswerCheckbox',
        ...baseProps,
        options: originalQuestion.Options?.map((option) => option.Label) || [],
      }
    case 'TextBox':
      return {
        __typename: 'HealthQuestionnaireAnswerText',
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
        maxLength: originalQuestion.MaxLength || undefined,
      }
    case 'NumBox':
      return {
        __typename: 'HealthQuestionnaireAnswerNumber',
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
        min: originalQuestion.MinValue || undefined,
        max: originalQuestion.MaxValue || undefined,
      }
    case 'Number':
      return {
        __typename: 'HealthQuestionnaireAnswerNumber',
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
        min: originalQuestion.MinValue || undefined,
        max: originalQuestion.MaxValue || undefined,
      }
    case 'Slider':
      if (
        originalQuestion.MinValue !== null &&
        originalQuestion.MaxValue !== null
      ) {
        return {
          __typename: 'HealthQuestionnaireAnswerScale',
          ...baseProps,
          minLabel: 'Min',
          maxLabel: 'Max',
          minValue: originalQuestion.MinValue,
          maxValue: originalQuestion.MaxValue,
        }
      } else {
        return {
          __typename: 'HealthQuestionnaireAnswerThermometer',
          ...baseProps,
          maxLabel: 'Høy',
          minLabel: 'Lav',
        }
      }
    case 'Dropdown':
      return {
        __typename: 'HealthQuestionnaireAnswerRadio',
        ...baseProps,
        options: originalQuestion.Options?.map((option) => option.Label) || [],
      }
    case 'Label':
      return {
        __typename: 'HealthQuestionnaireAnswerLabel',
        ...baseProps,
      }
    default:
      return {
        __typename: 'HealthQuestionnaireAnswerText',
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
        maxLength: originalQuestion.MaxLength || undefined,
      }
  }
}

const mapDisplayType = (
  required: boolean,
  visible: string,
): QuestionDisplayType => {
  if (visible === '0' || visible === 'false') {
    return QuestionDisplayType.hidden
  }
  return required ? QuestionDisplayType.required : QuestionDisplayType.optional
}

// Helper function to detect if a question is a "What else?" type question
const isWhatElseQuestion = (
  questionText: string,
  config = defaultDependencyConfig,
): boolean => {
  return config.whatElsePatterns.some((pattern) => pattern.test(questionText))
}

// Helper function to detect if an option is "Other" type
const isOtherOption = (
  optionLabel: string,
  config = defaultDependencyConfig,
): boolean => {
  return config.otherPatterns.some((pattern) => pattern.test(optionLabel))
}

// Helper function to detect if an option is "Yes" type
const isYesOption = (
  optionLabel: string,
  config = defaultDependencyConfig,
): boolean => {
  return config.yesPatterns.some((pattern) => pattern.test(optionLabel))
}

// Helper function to detect if an option is "No" type
const isNoOption = (
  optionLabel: string,
  config = defaultDependencyConfig,
): boolean => {
  return config.noPatterns.some((pattern) => pattern.test(optionLabel))
}

// Helper function to detect follow-up questions
const isFollowUpQuestion = (
  questionText: string,
  config = defaultDependencyConfig,
): boolean => {
  return config.followUpPatterns.some((pattern) => pattern.test(questionText))
}

// Function to create visibility condition based on dependency pattern
const createVisibilityCondition = (
  dependentQuestion: OriginalQuestion,
  parentQuestion: OriginalQuestion,
  targetOption: OriginalOption,
): string => {
  // Use new unified format
  const condition = {
    questionId: parentQuestion.EntryID,
    operator: 'equals' as const,
    value: targetOption.Label,
  }
  return JSON.stringify(condition)
}

// Function to analyze dependencies based on patterns and original DependsOn data
const analyzeDependencies = (
  allQuestions: OriginalQuestion[],
  currentQuestion: OriginalQuestion,
  questionIndex: number,
): { dependsOn?: string[]; visibilityCondition?: string } => {
  // Check if question has explicit dependencies in the original data
  if (
    currentQuestion.DependsOn &&
    Array.isArray(currentQuestion.DependsOn) &&
    currentQuestion.DependsOn.length > 0
  ) {
    // Handle explicit dependencies from the original data
    const dependsOn = currentQuestion.DependsOn.filter(
      (dep) => dep && typeof dep === 'string',
    ) as string[]
    if (dependsOn.length > 0) {
      // Use new unified format
      const condition = {
        questionId: dependsOn[0],
        operator: 'equals' as const,
        value: 'Já',
      }
      return {
        dependsOn: dependsOn,
        visibilityCondition: JSON.stringify(condition),
      }
    }
  }

  // Pattern 1: "What else?" questions should depend on previous question with "Other" option
  if (isWhatElseQuestion(currentQuestion.Question)) {
    for (let i = questionIndex - 1; i >= 0; i--) {
      const prevQuestion = allQuestions[i]
      if (prevQuestion.Options) {
        const otherOption = prevQuestion.Options.find((opt) =>
          isOtherOption(opt.Label),
        )
        if (otherOption) {
          return {
            dependsOn: [prevQuestion.EntryID],
            visibilityCondition: createVisibilityCondition(
              currentQuestion,
              prevQuestion,
              otherOption,
            ),
          }
        }
      }
    }
  }

  // Pattern 2: Questions that follow Yes/No questions and seem related
  if (questionIndex > 0) {
    const prevQuestion = allQuestions[questionIndex - 1]

    if (prevQuestion.Options) {
      const hasYesOption = prevQuestion.Options.some((opt) =>
        isYesOption(opt.Label),
      )
      const hasNoOption = prevQuestion.Options.some((opt) =>
        isNoOption(opt.Label),
      )

      if (hasYesOption && hasNoOption) {
        const isFollowUp = isFollowUpQuestion(currentQuestion.Question)

        if (isFollowUp) {
          const yesOption = prevQuestion.Options.find((opt) =>
            isYesOption(opt.Label),
          )
          if (yesOption) {
            return {
              dependsOn: [prevQuestion.EntryID],
              visibilityCondition: createVisibilityCondition(
                currentQuestion,
                prevQuestion,
                yesOption,
              ),
            }
          }
        }
      }
    }
  }

  return {}
}

const transformQuestion = (
  originalQuestion: OriginalQuestion,
  allQuestions: OriginalQuestion[],
  questionIndex: number,
): Question => {
  // Create the answer type based on the question type
  const answerType = createAnswerType(originalQuestion)

  // Create the answer option
  const answerOption: AnswerOption = {
    id: `${originalQuestion.EntryID}_answer`,
    label: originalQuestion.Question,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: answerType as any, // GraphQL union types need runtime resolution
    value: undefined, // Can be set later when user provides an answer
  }

  // Analyze dependencies for this question
  const dependencies = analyzeDependencies(
    allQuestions,
    originalQuestion,
    questionIndex,
  )

  return {
    id: originalQuestion.EntryID,
    label: originalQuestion.Question,
    sublabel: originalQuestion.Description || undefined,
    display: mapDisplayType(
      originalQuestion.Required,
      originalQuestion.Visible,
    ),
    answerOptions: answerOption,
    dependsOn: dependencies.dependsOn,
    visibilityCondition: dependencies.visibilityCondition,
  }
}

const transformData = (originalData: OriginalData): QuestionnairesList => {
  const allQuestions: Question[] = []
  const allOriginalQuestions: OriginalQuestion[] = []

  // First, collect all original questions from all sections
  originalData.Sections.forEach((section) => {
    section.Questions.forEach((question) => {
      allOriginalQuestions.push(question)
    })
  })

  // Then transform each question with context about all questions
  allOriginalQuestions.forEach((question, index) => {
    allQuestions.push(transformQuestion(question, allOriginalQuestions, index))
  })

  const questionnaire: Questionnaire = {
    id: originalData.GUID,
    title: originalData.Header,
    description: originalData.Description,
    sentDate: new Date().toISOString(),
    status: QuestionnairesStatusEnum.notAnswered,
    organization: 'Landspítali',
    questions: allQuestions,
  }

  return {
    questionnaires: [questionnaire],
  }
}

// Generic function to transform any questionnaire data
export const transformQuestionnaire = (
  originalData: OriginalData,
): QuestionnairesList => {
  return transformData(originalData)
}

// Function to transform a JSON file and save as TypeScript
export const transformJsonFile = (
  inputFilePath: string,
  outputFilePath?: string,
): void => {
  try {
    // Read the JSON file
    const jsonContent = fs.readFileSync(inputFilePath, 'utf8')
    const originalData = JSON.parse(jsonContent) as OriginalData

    // Transform the data
    const transformedData = transformData(originalData)

    // Generate TypeScript content
    const tsContent = generateTypeScriptContent(transformedData)

    // Determine output file path
    const outputPath =
      outputFilePath || inputFilePath.replace('.json', '_transformed.ts')

    // Write the TypeScript file
    fs.writeFileSync(outputPath, tsContent)

    console.log('Transformation completed successfully!')
    console.log(`Source file: ${inputFilePath}`)
    console.log(`Transformed file: ${outputPath}`)
    if (transformedData.questionnaires?.[0]) {
      console.log(
        `Number of questions transformed: ${
          transformedData.questionnaires[0].questions?.length || 0
        }`,
      )

      // Count questions with dependencies
      const questionsWithDeps =
        transformedData.questionnaires[0].questions?.filter(
          (q) => q.dependsOn,
        ) || []
      console.log(`Questions with dependencies: ${questionsWithDeps.length}`)
    }
  } catch (error) {
    console.error('Error during transformation:', error)
    throw error
  }
}

// Transform withou file reading/writing
export const transformQuestionnaireData = (
  jsonData: any,
): QuestionnairesList => {
  const data = JSON.parse(jsonData) as OriginalData

  const transformedData = transformData(data)
  return transformedData
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

  // Replace __typename references
  jsonString = jsonString.replace(
    /"__typename":\s*"([^"]+)"/g,
    '__typename: "$1" as const',
  )

  return `import { QuestionDisplayType } from '../models/question.model'
import { QuestionnairesStatusEnum } from '../models/questionnaires.model'

export const data = ${jsonString}
`
}

// CLI-style interface for transforming questionnaires
const transformQuestionnaireFromArgs = (): void => {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log(
      'Usage: npx ts-node transform.ts <input-json-file> [output-ts-file]',
    )
    console.log(
      'Example: npx ts-node transform.ts ./lsh_list_1.json ./lsh_list_1_transformed.ts',
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
    transformJsonFile(inputFile, outputFile)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Execute the transformation when script is run directly
if (require.main === module) {
  transformQuestionnaireFromArgs()
}
