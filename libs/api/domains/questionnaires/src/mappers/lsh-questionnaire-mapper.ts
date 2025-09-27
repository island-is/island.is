import {
  QuestionDisplayType,
  Question,
  AnswerOption,
  AnswerOptionType,
} from '../models/question.model'
import {
  Questionnaire,
  QuestionnaireSection,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'

// Type definitions for the original LSH JSON structure
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

// Map original question type to answer option type
const createAnswerType = (
  originalQuestion: OriginalQuestion,
): Record<string, unknown> => {
  const baseProps = {
    id: `${originalQuestion.EntryID}_type`,
    sublabel: originalQuestion.Description || undefined,
    display: mapDisplayType(
      originalQuestion.Required,
      originalQuestion.Visible,
    ),
  }

  switch (originalQuestion.Type) {
    case 'List':
      if (!originalQuestion.Options) {
        return {
          type: AnswerOptionType.text,
          ...baseProps,
        }
      }
      return {
        type: AnswerOptionType.radio,
        ...baseProps,
        options: originalQuestion.Options.map((option) => option.Label),
      }
    case 'YesNo':
      return {
        type: AnswerOptionType.radio,
        ...baseProps,
        options: ['Já', 'Nei'],
      }
    case 'Number':
      return {
        type: AnswerOptionType.number,
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
        min: originalQuestion.MinValue || undefined,
        max: originalQuestion.MaxValue || undefined,
      }
    case 'Date':
      return {
        type: AnswerOptionType.text,
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
      }
    case 'Text':
    default:
      return {
        type: AnswerOptionType.text,
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

  // Create the flattened answer option - move all properties from answerType to top level
  const answerOption: AnswerOption = {
    id: `${originalQuestion.EntryID}_answer`,
    value: undefined, // Can be set later when user provides an answer
    // Ensure type is always present
    type: (answerType as { type: AnswerOptionType }).type,
    // Spread all the answer type properties directly into answerOption
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(answerType as any), // Cast to any for now since we have many different answer types
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
  const sections: QuestionnaireSection[] = []

  // Process each section
  originalData.Sections.forEach((section) => {
    const questions: Question[] = []

    // Transform each question with context about all questions in the section
    section.Questions.forEach((question, index) => {
      const transformedQuestion = transformQuestion(
        question,
        section.Questions,
        index,
      )
      questions.push(transformedQuestion)
    })

    sections.push({
      sectionTitle: section.Caption,
      questions,
    })
  })

  const questionnaire: Questionnaire = {
    id: originalData.GUID,
    title: originalData.Header,
    description: originalData.Description,
    sentDate: new Date().toISOString(),
    status: QuestionnairesStatusEnum.notAnswered,
    organization: 'Landspítali',
    sections,
  }

  return {
    questionnaires: [questionnaire],
  }
}

/**
 * Transform LSH (Landspítali) questionnaire data to internal format
 * @param originalData - The raw LSH questionnaire data
 * @returns Transformed questionnaire data
 */
export const transformLshQuestionnaire = (
  originalData: OriginalData,
): QuestionnairesList => {
  return transformData(originalData)
}

/**
 * Transform LSH questionnaire from JSON string
 * @param jsonString - JSON string containing LSH questionnaire data
 * @returns Transformed questionnaire data
 */
export const transformLshQuestionnaireFromJson = (
  jsonString: string,
): QuestionnairesList => {
  const originalData = JSON.parse(jsonString) as OriginalData
  return transformLshQuestionnaire(originalData)
}

/**
 * Transform LSH questionnaire with custom dependency configuration
 * @param originalData - The raw LSH questionnaire data
 * @param config - Custom dependency pattern configuration
 * @returns Transformed questionnaire data
 */
export const transformLshQuestionnaireWithConfig = (
  originalData: OriginalData,
  _config: Partial<DependencyConfig>,
): QuestionnairesList => {
  // TODO: Merge custom config with defaults and pass through helper functions
  // const mergedConfig = { ...defaultDependencyConfig, ...config }

  // Note: The config would need to be passed through the helper functions
  // This is a placeholder for future enhancement
  return transformData(originalData)
}
