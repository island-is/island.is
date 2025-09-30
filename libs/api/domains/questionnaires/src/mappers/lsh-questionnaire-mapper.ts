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
import { Form } from '@island.is/clients/health-directorate'

// Type definitions for the actual LSH JSON structure based on real data
interface OriginalOption {
  Label: string
  Value: string
}

interface OriginalQuestion {
  Options?: OriginalOption[] | null
  Question: string
  Description: string | null
  EntryID: string
  Type: string // Types: "SingleSelect", "MultiSelect", "Number", "String", "Label"
  MaxLength: number | null
  Required: boolean
  MinValue: number | null
  MaxValue: number | null
  Instructions: string | null
  Visible: string
  DependsOn: string[]
  Dependants: string[]
  Formula: string | null
  PostLabel: string | null
  Translations: string
  ShowToPatient: string
  Slider: string | null
  SendForCalculation: string
  HideTime: string | null
  MonthYear: string | null
  ShowTime: string | null
  display_class?: string | null // Display class for special rendering (e.g., "thermometer")
}

interface OriginalSection {
  Questions: OriginalQuestion[]
  Caption: string
}

interface OriginalData {
  Sections: OriginalSection[]
  Header?: string
  Description?: string
  FormID?: string
  GUID?: string
  AvailableTranslations?: string
  Translations?: string
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
    case 'SingleSelect':
      if (!originalQuestion.Options || originalQuestion.Options.length === 0) {
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
    case 'MultiSelect':
      if (!originalQuestion.Options || originalQuestion.Options.length === 0) {
        return {
          type: AnswerOptionType.text,
          ...baseProps,
        }
      }
      return {
        type: AnswerOptionType.checkbox,
        ...baseProps,
        options: originalQuestion.Options.map((option) => option.Label),
      }
    case 'Number':
      // Check if it's a thermometer based on display_class
      if (originalQuestion.display_class === 'thermometer') {
        return {
          type: AnswerOptionType.thermometer,
          ...baseProps,
          placeholder: originalQuestion.Instructions || undefined,
          min: originalQuestion.MinValue || 0,
          max: originalQuestion.MaxValue || 100,
          minLabel: originalQuestion.Instructions || 'Minimum',
          maxLabel: 'Maximum',
        }
      }
      // Check if it's a slider based on Slider field
      if (originalQuestion.Slider === '1') {
        return {
          type: AnswerOptionType.slider,
          ...baseProps,
          placeholder: originalQuestion.Instructions || undefined,
          min: originalQuestion.MinValue || undefined,
          max: originalQuestion.MaxValue || undefined,
          minLabel: `${originalQuestion.MinValue || 0}`,
          maxLabel: `${originalQuestion.MaxValue || 100}`,
        }
      }
      return {
        type: AnswerOptionType.number,
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
        min: originalQuestion.MinValue || undefined,
        max: originalQuestion.MaxValue || undefined,
      }
    case 'String':
      return {
        type: AnswerOptionType.text,
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
        maxLength: originalQuestion.MaxLength || undefined,
      }
    case 'Label':
      // Label types are informational only, display as label
      return {
        type: AnswerOptionType.label,
        ...baseProps,
        label: originalQuestion.Question, // Use the question text as the label content
      }
    case 'Date':
      return {
        type: AnswerOptionType.date,
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
      }
    case 'DateTime':
      return {
        type: AnswerOptionType.datetime,
        ...baseProps,
        placeholder: originalQuestion.Instructions || undefined,
      }
    case 'List': // Legacy support
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
    case 'YesNo': // Legacy support
      return {
        type: AnswerOptionType.radio,
        ...baseProps,
        options: ['Já', 'Nei'],
      }
    case 'Text': // Legacy support
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

// Parse LSH visibility conditions for Form interface
const parseLshVisibilityCondition = (condition: string): string => {
  try {
    if (!condition || condition.trim() === '') {
      return '' // No condition means always visible
    }

    const originalCondition = condition
    let cleanCondition = condition.trim()

    // Step 1: Handle not() wrapper around isSelected calls
    // Pattern: not(isSelected('Value',@@@QuestionID)) → isNotSelected('Value',@@@QuestionID)
    cleanCondition = cleanCondition.replace(
      /not\(isSelected\('([^']+)',@@@([^)]+)\)\)/g,
      "isNotSelected('$1',@@@$2)",
    )

    // Step 2: Handle regular isSelected calls and convert to condition objects
    // Pattern: isSelected('Value',@@@QuestionID) → {"questionId":"QuestionID","operator":"equals","value":"Value"}
    cleanCondition = cleanCondition.replace(
      /isSelected\('([^']+)',@@@([^)]+)\)/g,
      (match, value, questionId) => {
        const conditionObj = {
          questionId: questionId,
          operator: 'equals' as const,
          value: value,
        }
        return JSON.stringify(conditionObj)
      },
    )

    // Step 3: Handle isNotSelected calls (from step 1) and convert to condition objects with notEquals
    // Pattern: isNotSelected('Value',@@@QuestionID) → {"questionId":"QuestionID","operator":"notEquals","value":"Value"}
    cleanCondition = cleanCondition.replace(
      /isNotSelected\('([^']+)',@@@([^)]+)\)/g,
      (match, value, questionId) => {
        const conditionObj = {
          questionId: questionId,
          operator: 'notEquals' as const,
          value: value,
        }
        return JSON.stringify(conditionObj)
      },
    )

    // Step 4: Handle complex boolean expressions by creating a compound condition
    if (cleanCondition.includes('&&') || cleanCondition.includes('||')) {
      // Split on && and || operators while preserving the operators
      const parts = cleanCondition.split(/(\s*&&\s*|\s*\|\|\s*)/)
      const conditions = []

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim()
        if (part !== '&&' && part !== '||' && part !== '') {
          try {
            // Try to parse as JSON condition
            const parsed = JSON.parse(part)
            conditions.push(parsed)
          } catch (parseError) {
            // If not valid JSON, log the issue but continue
            console.warn(
              'Could not parse condition part as JSON:',
              part,
              'from original:',
              originalCondition,
            )
          }
        }
      }

      // For now, return the first condition (we can enhance this later for full boolean logic support)
      if (conditions.length > 0) {
        return JSON.stringify(conditions[0])
      }
    }

    // Step 5: If it's already a single JSON condition, return it
    try {
      JSON.parse(cleanCondition)
      return cleanCondition
    } catch (parseError) {
      // If we can't parse it as JSON, check if we have unparsed patterns
      if (
        cleanCondition.includes('isSelected') ||
        cleanCondition.includes('isNotSelected')
      ) {
        console.warn(
          'Found unparsed isSelected pattern. Original:',
          originalCondition,
          'Processed:',
          cleanCondition,
        )
      }

      console.warn(
        'Could not parse LSH visibility condition as final JSON:',
        originalCondition,
        'Processed:',
        cleanCondition,
      )
      return '' // Return empty to make question always visible rather than breaking
    }
  } catch (error) {
    console.error(
      'Error in parseLshVisibilityCondition:',
      error,
      'Input condition:',
      condition,
    )
    return '' // Return empty on any error to prevent crashes
  }
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

  // Check for complex visibility conditions in the Visible field
  let finalVisibilityCondition = dependencies.visibilityCondition
  let finalDependsOn = dependencies.dependsOn

  if (
    originalQuestion.Visible &&
    originalQuestion.Visible !== 'True' &&
    originalQuestion.Visible.trim() !== ''
  ) {
    // Parse complex LSH visibility condition
    const parsedCondition = parseLshVisibilityCondition(
      originalQuestion.Visible,
    )

    if (parsedCondition) {
      finalVisibilityCondition = parsedCondition

      // Extract question IDs from the visibility condition for dependsOn
      const questionIdMatches = originalQuestion.Visible.match(/@@@([^)]+)/g)
      if (questionIdMatches) {
        const extractedQuestionIds = questionIdMatches.map(
          (match) => match.replace('@@@', '').replace(/[\s)]/g, ''), // Clean up any trailing spaces or parentheses
        )

        // Merge with existing dependencies, avoiding duplicates
        const allDependencies = [
          ...(finalDependsOn || []),
          ...extractedQuestionIds,
        ]
        finalDependsOn = [...new Set(allDependencies)] // Remove duplicates
      }
    }
  }

  return {
    id: originalQuestion.EntryID,
    label: originalQuestion.Question,
    sublabel: originalQuestion.Description || undefined,
    display: mapDisplayType(
      originalQuestion.Required,
      originalQuestion.Visible,
    ),
    answerOptions: answerOption,
    dependsOn: finalDependsOn,
    visibilityCondition: finalVisibilityCondition,
  }
}

const transformData = (originalData: OriginalData): QuestionnairesList => {
  const sections: QuestionnaireSection[] = []

  // Process each section
  originalData.Sections?.forEach((section) => {
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
    id: originalData.GUID || 'unknown-id',
    title: originalData.Header || 'Spurningalisti',
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

/**
 * Transform LSH Form to internal questionnaire format
 * @param form - The Form object from LSH API
 * @returns Transformed questionnaire data
 */
export const transformLshForm = (form: Form): Questionnaire => {
  // Parse the formJSON to get the actual questionnaire structure
  const originalData = JSON.parse(form.formJSON) as OriginalData

  const sections: QuestionnaireSection[] = []

  // Process each section
  originalData.Sections?.forEach((section) => {
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

  // Determine status based on whether form has been answered
  const status = form.answersJSON
    ? QuestionnairesStatusEnum.answered
    : QuestionnairesStatusEnum.notAnswered

  const questionnaire: Questionnaire = {
    id: form.gUID || originalData.GUID || 'unknown-id',
    title: form.caption || originalData.Header || 'Spurningalisti',
    description: form.description || originalData.Description,
    sentDate: form.validFromDateTime.toISOString(),
    status,
    organization: form.location || 'Landspítali',
    sections,
  }

  return questionnaire
}

/**
 * Transform multiple LSH Forms to questionnaires list
 * @param forms - Array of Form objects from LSH API
 * @returns Transformed questionnaires list
 */
export const transformLshForms = (forms: Form[]): QuestionnairesList => {
  const questionnaires = forms.map(transformLshForm)

  return {
    questionnaires,
  }
}

/**
 * Transform LSH Form with existing answers
 * @param form - The Form object from LSH API
 * @returns Transformed questionnaire with pre-filled answers
 */
export const transformLshFormWithAnswers = (form: Form): Questionnaire => {
  const questionnaire = transformLshForm(form)

  // If there are existing answers, parse and apply them
  if (form.answersJSON) {
    try {
      const existingAnswers = JSON.parse(form.answersJSON) as Array<{
        EntryID: string
        Value: string
        Type?: string
      }>

      // Apply answers to questions - this would need to match the answer format
      questionnaire.sections?.forEach((section) => {
        section.questions?.forEach((question) => {
          // Find matching answer by EntryID
          const matchingAnswer = existingAnswers.find(
            (answer) => answer.EntryID === question.id,
          )

          if (matchingAnswer && question.answerOptions) {
            // Set the answer value based on the AnswerOptionValue structure
            question.answerOptions.value = {
              extraQuestions: [matchingAnswer.Value], // Store the answer value in extraQuestions for now
            }
          }
        })
      })
    } catch (error) {
      console.warn('Failed to parse existing answers:', error)
    }
  }

  return questionnaire
}
