import type {
  HealthQuestionnaire,
  HealthQuestionnaireQuestion,
} from '../../../utils/questionnaire'

// LSH Data Types
interface LSHOption {
  label: string
  value: string
}

interface LSHQuestion {
  options?: LSHOption[]
  question: string
  description?: string
  entryID: string
  type: string
  maxLength?: number
  required: boolean
  minValue?: number
  maxValue?: number
  instructions?: string
  postLabel?: string
  visible?: string
  dependsOn?: string[]
  dependants?: string[]
}

interface LSHSection {
  questions: LSHQuestion[]
  caption: string
}

interface LSHData {
  sections: LSHSection[]
  id: string
  guid: string
  header: string
  description: string
}

// Create a safe option ID from label removing icelandic letters
const createOptionId = (label: string, index: number): string => {
  return (
    label
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `option-${index}`
  )
}

// Convert LSH question to GraphQL format - temp?
const convertQuestion = (
  lshQuestion: LSHQuestion,
): HealthQuestionnaireQuestion | null => {
  const baseQuestion = {
    id: lshQuestion.entryID,
    label: lshQuestion.question,
    sublabel: lshQuestion.description || lshQuestion.instructions || undefined,
    display: lshQuestion.required ? 'required' : 'optional',
    dependsOn:
      lshQuestion.dependsOn && lshQuestion.dependsOn.length > 0
        ? lshQuestion.dependsOn
        : undefined,
    visibilityCondition: lshQuestion.visible || undefined,
  }

  switch (lshQuestion.type) {
    case 'SingleSelect': {
      if (!lshQuestion.options || lshQuestion.options.length === 0) {
        return null
      }
      return {
        __typename: 'HealthQuestionnaireAnswerRadio',
        ...baseQuestion,
        answerOptions: lshQuestion.options.map(
          (option: LSHOption, index: number) => ({
            id: createOptionId(option.label, index),
            label: option.label,
            type: 'radio',
            value: { extraQuestions: [] },
          }),
        ),
      }
    }

    case 'MultiSelect': {
      if (!lshQuestion.options || lshQuestion.options.length === 0) {
        return null
      }
      return {
        __typename: 'HealthQuestionnaireAnswerMultiple',
        ...baseQuestion,
        answerOptions: lshQuestion.options.map(
          (option: LSHOption, index: number) => ({
            id: createOptionId(option.label, index),
            label: option.label,
            type: 'checkbox',
            value: { extraQuestions: [] },
          }),
        ),
      }
    }

    case 'Number': {
      // Set reasonable defaults based on PostLabel or question content
      let min = 0
      let max = 1000
      let step = 1
      let unit = ''

      if (lshQuestion.postLabel) {
        unit = lshQuestion.postLabel
        if (unit === 'cm') {
          min = 50
          max = 250
          step = 1
        } else if (unit === 'kg') {
          min = 20
          max = 300
          step = 0.1
        } else if (unit.includes('ár')) {
          min = 0
          max = 120
          step = 1
        }
      }

      // Override with actual values if provided
      if (lshQuestion.minValue !== undefined) min = lshQuestion.minValue
      if (lshQuestion.maxValue !== undefined) max = lshQuestion.maxValue

      return {
        __typename: 'HealthQuestionnaireAnswerNumber',
        ...baseQuestion,
        min,
        max,
        step,
        unit,
      }
    }

    case 'String': {
      // Determine if it should be a text area based on MaxLength
      const isTextArea = lshQuestion.maxLength && lshQuestion.maxLength > 100

      return {
        __typename: isTextArea
          ? 'HealthQuestionnaireAnswerTextArea'
          : 'HealthQuestionnaireAnswerText',
        ...baseQuestion,
      }
    }

    case 'Label':
      // Skip label types as they're informational only
      return null

    default:
      console.warn(`Unknown question type: ${lshQuestion.type}`)
      return null
  }
}

// Function to convert the entire LSH dataset
export const convertLSHData = (lshData: LSHData): HealthQuestionnaire => {
  const allQuestions: HealthQuestionnaireQuestion[] = []

  // Process all sections
  if (lshData.sections) {
    lshData.sections.forEach((section: LSHSection) => {
      if (section.questions) {
        section.questions.forEach((question: LSHQuestion) => {
          const converted = convertQuestion(question)
          if (converted) {
            allQuestions.push(converted)
          }
        })
      }
    })
  }

  return {
    __typename: 'HealthQuestionnaire',
    org: 'Landlæknir (LSH)',
    id: 'Form36806',
    title: lshData.header,
    description: lshData.description,
    guid: lshData.guid,
    questions: allQuestions,
  }
}
