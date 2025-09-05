import * as fs from 'fs'
import * as path from 'path'

// Type definitions for the original structure
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

// Type definitions for the new structure
interface AnswerOption {
  id: string
  label: string
  type: 'radio' | 'checkbox' | 'text' | 'number' | 'select' | 'thermometer'
  value?: unknown
}

interface Question {
  __typename: 'Question'
  id: string
  label: string
  sublabel?: string
  display: 'required' | 'optional' | 'hidden'
  answerOptions?: AnswerOption[]
}

interface Questionnaire {
  id: string
  title: string
  description: string
  sentDate: string
  status: 'answered' | 'notAnswered' | 'expired'
  organization: string
  questions: Question[]
}

interface QuestionnairesList {
  questionnaires: Questionnaire[]
}

const mapQuestionType = (
  originalType: string,
): 'radio' | 'checkbox' | 'text' | 'number' | 'select' | 'thermometer' => {
  switch (originalType) {
    case 'SingleSelect':
      return 'radio'
    case 'MultiSelect':
      return 'checkbox'
    case 'TextBox':
      return 'text'
    case 'NumBox':
      return 'number'
    case 'Dropdown':
      return 'select'
    case 'Slider':
      return 'thermometer'
    default:
      return 'text'
  }
}

const mapDisplayType = (
  required: boolean,
  visible: string,
): 'required' | 'optional' | 'hidden' => {
  if (visible === '0' || visible === 'false') {
    return 'hidden'
  }
  return required ? 'required' : 'optional'
}

const transformQuestion = (originalQuestion: OriginalQuestion): Question => {
  const answerOptions: AnswerOption[] = []

  if (originalQuestion.Options && originalQuestion.Options.length > 0) {
    originalQuestion.Options.forEach((option, optionIndex) => {
      answerOptions.push({
        id: `${originalQuestion.EntryID}_option_${optionIndex + 1}`,
        label: option.Label,
        type: mapQuestionType(originalQuestion.Type),
        value: null,
      })
    })
  }

  return {
    __typename: 'Question',
    id: originalQuestion.EntryID,
    label: originalQuestion.Question,
    sublabel: originalQuestion.Description || undefined,
    display: mapDisplayType(
      originalQuestion.Required,
      originalQuestion.Visible,
    ),
    answerOptions: answerOptions.length > 0 ? answerOptions : undefined,
  }
}

const transformData = (originalData: OriginalData): QuestionnairesList => {
  const allQuestions: Question[] = []

  // Flatten all questions from all sections
  originalData.Sections.forEach((section) => {
    section.Questions.forEach((question) => {
      allQuestions.push(transformQuestion(question))
    })
  })

  const questionnaire: Questionnaire = {
    id: originalData.GUID,
    title: originalData.Header,
    description: originalData.Description,
    sentDate: new Date().toISOString(),
    status: 'notAnswered',
    organization: 'Landspítali',
    questions: allQuestions,
  }

  return {
    questionnaires: [questionnaire],
  }
}

// Main transformation function
const transformFile = () => {
  const inputPath = path.join(__dirname, 'lsh_list_1.json')
  const outputPath = path.join(__dirname, 'lsh_list_1_transformed.json')

  try {
    // Read the original file
    const originalData: OriginalData = JSON.parse(
      fs.readFileSync(inputPath, 'utf8'),
    )

    // Transform the data
    const transformedData = transformData(originalData)

    // Write the transformed data
    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2))

    console.log('Transformation completed successfully!')
    console.log(`Original file: ${inputPath}`)
    console.log(`Transformed file: ${outputPath}`)
    console.log(
      `Number of questions transformed: ${transformedData.questionnaires[0].questions.length}`,
    )
  } catch (error) {
    console.error('Error during transformation:', error)
  }
}

// Run the transformation
transformFile()
