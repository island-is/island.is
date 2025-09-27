// Generic types until the health-directorate client exports are available
interface HealthDirectorateQuestionnaireDetailDto {
  questionnaireId: string
  title?: string
  message?: string
  hint?: string
  numRepliesAllowed: number
  numSubmissions: number
  lastSubmitted?: Date
  daysBetweenReplies: number
  createdDate?: Date
  expiryDate?: Date
  canSubmit: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submissions: any[]
  hasDraft: boolean
  groups: HealthDirectorateQuestionGroupDto[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  triggers: { [key: string]: any[] }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replies?: any[]
}

interface HealthDirectorateQuestionGroupDto {
  id?: string
  title?: string
  hint?: string
  visible?: boolean
  items: HealthDirectorateQuestionDto[]
}

interface HealthDirectorateQuestionDto {
  id: string
  type: string // 'string' | 'number' | 'list' | 'bool' | 'date' | 'table' | 'attachment' | 'text'
  label: string
  htmlLabel?: string
  hint?: string
  required?: boolean
  active?: boolean
  visible?: boolean
  // String/Text specific
  maxLength?: number
  multiline?: boolean
  _default?: string
  // Number specific
  min?: number
  max?: number
  minDescription?: string
  maxDescription?: string
  // List specific
  minSelections?: number
  maxSelections?: number
  multiselect?: boolean
  values?: Array<{ id: string; label?: string }>
}

// Standardized visibility condition interface for better type safety and clarity
interface VisibilityCondition {
  questionId: string
  operator: 'equals' | 'contains' | 'not_equals' | 'not_contains'
  value: string | string[]
  visible: boolean
}

import {
  Questionnaire,
  QuestionnaireSection,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../models/questionnaires.model'
import {
  Question,
  QuestionDisplayType,
  AnswerOptionType,
} from '../models/question.model'

// Type for all possible question DTOs from the client
type ClientQuestionDto = HealthDirectorateQuestionDto

// Question type enum values
enum QuestionTypeEnum {
  String = 'string',
  Bool = 'bool',
  Date = 'date',
  Number = 'number',
  List = 'list',
  Table = 'table',
  Attachment = 'attachment',
  Text = 'text',
}

/**
 * Creates a standardized visibility condition object
 */
const createVisibilityCondition = (
  questionId: string,
  operator: VisibilityCondition['operator'],
  value: string | string[],
  visible = true,
): VisibilityCondition => ({
  questionId,
  operator,
  value,
  visible,
})

/**
 * Serializes a visibility condition to JSON string for storage
 */
const serializeVisibilityCondition = (
  condition: VisibilityCondition,
): string => {
  try {
    return JSON.stringify(condition)
  } catch (error) {
    console.warn('Failed to serialize visibility condition:', error)
    return JSON.stringify({
      questionId: condition.questionId,
      operator: 'equals',
      value: '',
      visible: condition.visible,
    })
  }
}

/**
 * Parses a visibility condition from JSON string with validation
 */
const parseVisibilityCondition = (
  conditionString: string,
): VisibilityCondition | null => {
  try {
    const parsed = JSON.parse(conditionString)

    // Validate the structure
    if (
      parsed &&
      typeof parsed.questionId === 'string' &&
      ['equals', 'contains', 'not_equals', 'not_contains'].includes(
        parsed.operator,
      ) &&
      (typeof parsed.value === 'string' || Array.isArray(parsed.value)) &&
      typeof parsed.visible === 'boolean'
    ) {
      return parsed as VisibilityCondition
    }

    console.warn('Invalid visibility condition structure:', parsed)
    return null
  } catch (error) {
    console.warn('Failed to parse visibility condition:', error)
    return null
  }
}

/**
 * Maps the client's visibility/required flags to our QuestionDisplayType enum
 */
const mapDisplayType = (
  required?: boolean,
  visible?: boolean,
): QuestionDisplayType => {
  if (visible === false) {
    return QuestionDisplayType.hidden
  }
  return required ? QuestionDisplayType.required : QuestionDisplayType.optional
}

/**
 * Maps the client's QuestionType to our AnswerOptionType enum
 */
const mapQuestionType = (
  clientType: string,
  questionDto: ClientQuestionDto,
): AnswerOptionType => {
  switch (clientType) {
    case QuestionTypeEnum.String:
    case QuestionTypeEnum.Text:
      return AnswerOptionType.text
    case QuestionTypeEnum.Number:
      return AnswerOptionType.number
    case QuestionTypeEnum.List: {
      const listQuestion = questionDto as HealthDirectorateQuestionDto
      // Check if it's multiselect to determine radio vs checkbox
      if (
        listQuestion.multiselect ||
        (listQuestion.maxSelections && listQuestion.maxSelections > 1)
      ) {
        return AnswerOptionType.checkbox
      }
      return AnswerOptionType.radio
    }
    case QuestionTypeEnum.Bool:
      return AnswerOptionType.radio // Boolean questions are typically rendered as Yes/No radio buttons
    case QuestionTypeEnum.Date:
      return AnswerOptionType.text // Date inputs are typically text fields with date picker
    case QuestionTypeEnum.Table:
      return AnswerOptionType.text // Tables can be handled as text for now
    case QuestionTypeEnum.Attachment:
      return AnswerOptionType.text // Attachments as text fields for now
    default:
      return AnswerOptionType.text
  }
}

/**
 * Find a question by its ID across all questions
 */
const findQuestionById = (
  allQuestions: HealthDirectorateQuestionDto[],
  questionId: string,
): HealthDirectorateQuestionDto | undefined => {
  return allQuestions.find((q) => q.id === questionId)
}

/**
 * Convert trigger contains IDs to actual option labels - works with both EL and LSH formats
 */
const mapContainsToLabels = (
  allQuestions: HealthDirectorateQuestionDto[],
  triggerId: string,
  contains: string[],
): string[] => {
  const triggerQuestion = findQuestionById(allQuestions, triggerId)
  if (!triggerQuestion || !triggerQuestion.values) {
    return contains // Return original if no mapping possible
  }

  return contains.map((containsId) => {
    const option = triggerQuestion.values?.find((opt) => opt.id === containsId)
    return option ? option.label || containsId : containsId // Return label if found, otherwise original ID
  })
}

/**
 * Validates if a trigger object has the expected structure
 */
const isValidTrigger = (trigger: unknown): boolean => {
  if (!trigger || typeof trigger !== 'object') return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = trigger as any

  // Check for required properties
  return (
    typeof t.triggerId === 'string' &&
    typeof t.targetId === 'string' &&
    typeof t.visible === 'boolean'
  )
}

/**
 * Analyze triggers (dependencies) for a question - robust version that works with both EL and LSH models
 */
const analyzeTriggers = (
  allQuestions: HealthDirectorateQuestionDto[],
  triggers: { [key: string]: unknown[] },
  currentQuestionId: string,
): { dependsOn?: string[]; visibilityCondition?: string } => {
  // Find triggers that target this question
  const relevantTriggers: unknown[] = []

  for (const [_triggerId, triggerList] of Object.entries(triggers)) {
    for (const trigger of triggerList) {
      if (isValidTrigger(trigger)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((trigger as any).targetId === currentQuestionId) {
          relevantTriggers.push(trigger)
        }
      }
    }
  }

  if (relevantTriggers.length === 0) {
    return {}
  }

  // Find the trigger with the most specific visibility condition (has contains array)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visibilityTrigger =
    relevantTriggers.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (t: any) =>
        t.visible &&
        t.contains &&
        Array.isArray(t.contains) &&
        t.contains.length > 0,
    ) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    relevantTriggers.find((t: any) => t.visible) ||
    relevantTriggers[0]

  if (!visibilityTrigger) {
    return {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trigger = visibilityTrigger as any

  try {
    // Map contains IDs to actual option labels
    const containsLabels =
      trigger.contains && Array.isArray(trigger.contains)
        ? mapContainsToLabels(allQuestions, trigger.triggerId, trigger.contains)
        : []

    // Determine operator and value based on the trigger data
    let operator: VisibilityCondition['operator'] = 'equals'
    let value: string | string[] = ''

    if (containsLabels.length > 1) {
      operator = 'contains'
      value = containsLabels
    } else if (containsLabels.length === 1) {
      operator = 'equals'
      value = containsLabels[0]
    } else {
      // Fallback for triggers without contains (like simple visibility toggles)
      operator = 'equals'
      value = 'true' // Default assumption for boolean-like visibility
    }

    // Create standardized visibility condition
    const condition = createVisibilityCondition(
      trigger.triggerId,
      operator,
      value,
      trigger.visible ?? true,
    )

    const visibilityCondition = serializeVisibilityCondition(condition)

    return {
      dependsOn: [trigger.triggerId],
      visibilityCondition,
    }
  } catch (error) {
    console.warn(
      `Error analyzing triggers for question ${currentQuestionId}:`,
      error,
    )

    // Return fallback dependency without visibility condition
    return {
      dependsOn: [trigger.triggerId],
    }
  }
}

/**
 * Transforms a client question DTO to our Question model
 */
const transformClientQuestion = (
  clientQuestion: ClientQuestionDto,
  allQuestions: HealthDirectorateQuestionDto[],
  triggers: { [key: string]: unknown[] },
): Question => {
  const answerOptionType = mapQuestionType(clientQuestion.type, clientQuestion)
  const displayType = mapDisplayType(
    clientQuestion.required,
    clientQuestion.visible,
  )

  // Create the flattened answer options based on question type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answerOptions: any = {
    id: `${clientQuestion.id}_answer`,
    type: answerOptionType,
    display: displayType,
    label: undefined, // We don't duplicate the label in answer options
  }

  // Add type-specific properties
  switch (clientQuestion.type) {
    case QuestionTypeEnum.String:
    case QuestionTypeEnum.Text: {
      const stringQ = clientQuestion as HealthDirectorateQuestionDto
      answerOptions.placeholder = stringQ.hint || undefined
      answerOptions.maxLength = stringQ.maxLength || undefined
      break
    }
    case QuestionTypeEnum.Number: {
      const numberQ = clientQuestion as HealthDirectorateQuestionDto
      answerOptions.placeholder = numberQ.hint || undefined
      answerOptions.min = numberQ.min || undefined
      answerOptions.max = numberQ.max || undefined
      // If min/max descriptions exist, could use them for labels
      answerOptions.minLabel = numberQ.minDescription || undefined
      answerOptions.maxLabel = numberQ.maxDescription || undefined
      break
    }
    case QuestionTypeEnum.List: {
      const listQ = clientQuestion as HealthDirectorateQuestionDto
      answerOptions.options =
        listQ.values?.map(
          (value: { id: string; label?: string }) => value.label || value.id,
        ) || []
      break
    }
    case QuestionTypeEnum.Bool: {
      // Boolean questions get Yes/No options
      answerOptions.options = ['Já', 'Nei'] // Icelandic Yes/No
      break
    }
    case QuestionTypeEnum.Date: {
      const dateQ = clientQuestion as HealthDirectorateQuestionDto
      answerOptions.placeholder = dateQ.hint || 'Veldu dagsetningu'
      break
    }
  }

  // Analyze triggers (dependencies) for this question
  const dependencies = analyzeTriggers(
    allQuestions,
    triggers,
    clientQuestion.id,
  )

  return {
    id: clientQuestion.id,
    label: clientQuestion.label,
    sublabel: clientQuestion.htmlLabel || clientQuestion.hint || undefined,
    display: displayType,
    answerOptions,
    dependsOn: dependencies.dependsOn,
    visibilityCondition: dependencies.visibilityCondition,
  }
}

/**
 * Transforms a client question group to our questions
 */
const transformQuestionGroup = (
  group: HealthDirectorateQuestionGroupDto,
  allQuestions: HealthDirectorateQuestionDto[],
  triggers: { [key: string]: unknown[] },
): Question[] => {
  return group.items.map((item) =>
    transformClientQuestion(item, allQuestions, triggers),
  )
}

/**
 * Determines questionnaire status based on client data
 */
const determineQuestionnaireStatus = (
  questionnaire: HealthDirectorateQuestionnaireDetailDto,
): QuestionnairesStatusEnum => {
  if (questionnaire.numSubmissions > 0) {
    return QuestionnairesStatusEnum.answered
  }

  if (
    questionnaire.expiryDate &&
    new Date(questionnaire.expiryDate) < new Date()
  ) {
    return QuestionnairesStatusEnum.expired
  }

  return QuestionnairesStatusEnum.notAnswered
}

/**
 * Main transform function: converts client questionnaire to our model
 */
export const transformHealthDirectorateQuestionnaire = (
  clientQuestionnaire: HealthDirectorateQuestionnaireDetailDto,
  organizationName = 'Heilbrigðisstofnun',
): Questionnaire => {
  // Collect all questions from all groups for trigger analysis
  const allQuestions: HealthDirectorateQuestionDto[] = []
  for (const group of clientQuestionnaire.groups) {
    allQuestions.push(...group.items)
  }

  // Transform each group into a section
  const sections: QuestionnaireSection[] = []
  for (const group of clientQuestionnaire.groups) {
    const groupQuestions = transformQuestionGroup(
      group,
      allQuestions,
      clientQuestionnaire.triggers,
    )

    sections.push({
      sectionTitle: group.title || undefined,
      questions: groupQuestions,
    })
  }

  const questionnaire: Questionnaire = {
    id: clientQuestionnaire.questionnaireId,
    title: clientQuestionnaire.title || 'Spurningalisti',
    description: clientQuestionnaire.message || clientQuestionnaire.hint || '',
    sentDate:
      clientQuestionnaire.createdDate?.toISOString() ||
      new Date().toISOString(),
    status: determineQuestionnaireStatus(clientQuestionnaire),
    organization: organizationName,
    sections,
  }

  return questionnaire
}

/**
 * Transforms a single client questionnaire to our questionnaires list model
 */
export const transformHealthDirectorateQuestionnaireToList = (
  clientQuestionnaire: HealthDirectorateQuestionnaireDetailDto,
  organizationName = 'Heilbrigðisstofnun',
): QuestionnairesList => {
  return {
    questionnaires: [
      transformHealthDirectorateQuestionnaire(
        clientQuestionnaire,
        organizationName,
      ),
    ],
  }
}

/**
 * Transforms multiple client questionnaires to our questionnaires list model
 */
export const transformHealthDirectorateQuestionnairesList = (
  clientQuestionnaires: HealthDirectorateQuestionnaireDetailDto[],
  organizationName = 'Heilbrigðisstofnun',
): QuestionnairesList => {
  return {
    questionnaires: clientQuestionnaires.map((q) =>
      transformHealthDirectorateQuestionnaire(q, organizationName),
    ),
  }
}

/**
 * Helper function to create a mock questionnaire for testing
 */
export const createMockHealthDirectorateQuestionnaire =
  (): HealthDirectorateQuestionnaireDetailDto => {
    return {
      questionnaireId: 'mock-health-questionnaire-1',
      title: 'Heilsufarskönnun',
      message: 'Vinsamlegast svarið eftirfarandi spurningum um heilsufar þitt.',
      numRepliesAllowed: 1,
      numSubmissions: 0,
      daysBetweenReplies: 0,
      canSubmit: true,
      submissions: [],
      hasDraft: false,
      triggers: {},
      groups: [
        {
          id: 'general-health',
          title: 'Almennt heilsufar',
          visible: true,
          items: [
            {
              id: 'health-rating',
              type: QuestionTypeEnum.List,
              label: 'Hvernig metur þú heilsufar þitt?',
              required: true,
              visible: true,
              multiselect: false,
              values: [
                { id: 'excellent', label: 'Mjög gott' },
                { id: 'good', label: 'Gott' },
                { id: 'fair', label: 'Sæmilegt' },
                { id: 'poor', label: 'Slæmt' },
              ],
            } as HealthDirectorateQuestionDto,
            {
              id: 'height',
              type: QuestionTypeEnum.Number,
              label: 'Hver er hæð þín?',
              hint: 'Sláðu inn hæð í sentímetrum',
              required: false,
              visible: true,
              min: 50,
              max: 250,
              minDescription: 'cm',
              maxDescription: 'cm',
            } as HealthDirectorateQuestionDto,
            {
              id: 'medications',
              type: QuestionTypeEnum.String,
              label: 'Taktu þú einhver lyf reglulega?',
              hint: 'Lýstu lyfjunum sem þú tekur',
              required: false,
              visible: true,
              multiline: true,
              maxLength: 500,
            } as HealthDirectorateQuestionDto,
          ],
        },
      ],
    }
  }

/**
 * Creates a mock questionnaire based on the EL (Distress Thermometer) structure
 */
export const createMockElDistressThermometerQuestionnaire =
  (): HealthDirectorateQuestionnaireDetailDto => {
    return {
      questionnaireId: 'dt-mat-a-vanlidan',
      title: 'DT - Mat á vanlíðan',
      message: 'Distress Thermometer - Assessment of distress',
      numRepliesAllowed: 1,
      numSubmissions: 0,
      daysBetweenReplies: 0,
      canSubmit: true,
      submissions: [],
      hasDraft: false,
      triggers: {
        '90': [
          {
            triggerId: '90',
            targetId: '100',
            visible: true,
            contains: ['91'],
            type: 'list',
          },
        ],
        '100': [
          {
            triggerId: '100',
            targetId: '120',
            visible: true,
            contains: ['110'],
            type: 'list',
          },
        ],
      },
      groups: [
        {
          id: 'thermometer-group',
          title: 'Vanlíðan',
          visible: true,
          items: [
            {
              id: '10',
              type: QuestionTypeEnum.Number,
              label:
                'Hversu mikla vanlíðan hefur þú fundið fyrir síðustu vikuna?',
              required: true,
              visible: true,
              min: 0,
              max: 10,
              minDescription: 'Engin vanlíðan',
              maxDescription: 'Óbærileg vanlíðan',
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'instruction-group',
          title: 'Leiðbeiningar',
          visible: true,
          items: [
            {
              id: '20',
              type: QuestionTypeEnum.Text,
              label:
                'Vinsamlegast merktu við þau vandamál sem hafa valdið þér vanlíðan síðustu vikuna, þar með talin í dag.',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'practical-problems',
          title: 'Verkleg vandamál',
          visible: true,
          items: [
            {
              id: '30',
              type: QuestionTypeEnum.Bool,
              label: 'Húsnæði',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '31',
              type: QuestionTypeEnum.Bool,
              label: 'Tryggingar',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '32',
              type: QuestionTypeEnum.Bool,
              label: 'Vinna/skóli',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '33',
              type: QuestionTypeEnum.Bool,
              label: 'Samgöngur',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '34',
              type: QuestionTypeEnum.Bool,
              label: 'Umönnun barna',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'family-problems',
          title: 'Fjölskylduvandi',
          visible: true,
          items: [
            {
              id: '40',
              type: QuestionTypeEnum.Bool,
              label: 'Að eiga við börn',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '41',
              type: QuestionTypeEnum.Bool,
              label: 'Að eiga við maka',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'emotional-problems',
          title: 'Tilfinningalegur vandi',
          visible: true,
          items: [
            {
              id: '50',
              type: QuestionTypeEnum.Bool,
              label: 'Þunglyndi',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '51',
              type: QuestionTypeEnum.Bool,
              label: 'Ótti',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '52',
              type: QuestionTypeEnum.Bool,
              label: 'Kvíði',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '53',
              type: QuestionTypeEnum.Bool,
              label: 'Áhyggjur',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '54',
              type: QuestionTypeEnum.Bool,
              label: 'Taugaveiklun',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'spiritual-problems',
          title: 'Andlegur/trúarlegur vandi',
          visible: true,
          items: [
            {
              id: '55',
              type: QuestionTypeEnum.Bool,
              label: 'Andlegur/trúarlegur vandi',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'physical-problems',
          title: 'Líkamlegur vandi',
          visible: true,
          items: [
            {
              id: '60',
              type: QuestionTypeEnum.Bool,
              label: 'Útlit',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '61',
              type: QuestionTypeEnum.Bool,
              label: 'Baða sig/klæðast',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '62',
              type: QuestionTypeEnum.Bool,
              label: 'Öndunarerfiðleikar',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '63',
              type: QuestionTypeEnum.Bool,
              label: 'Meltingarvandamál',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '64',
              type: QuestionTypeEnum.Bool,
              label: 'Þreyta',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '65',
              type: QuestionTypeEnum.Bool,
              label: 'Hreyfigeta',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '66',
              type: QuestionTypeEnum.Bool,
              label: 'Minnisglöp',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '67',
              type: QuestionTypeEnum.Bool,
              label: 'Ógleði',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '68',
              type: QuestionTypeEnum.Bool,
              label: 'Þurrkur eða stífla í nefi',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '69',
              type: QuestionTypeEnum.Bool,
              label: 'Verkir',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '70',
              type: QuestionTypeEnum.Bool,
              label: 'Kynlíf/samlíf',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '71',
              type: QuestionTypeEnum.Bool,
              label: 'Húðþurrkur/kláði',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '72',
              type: QuestionTypeEnum.Bool,
              label: 'Svefn',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '73',
              type: QuestionTypeEnum.Bool,
              label: 'Áfengi, fíkniefni eða lyf',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
            {
              id: '74',
              type: QuestionTypeEnum.Bool,
              label: 'Stingir í höndum/fótum',
              required: false,
              visible: true,
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'other-problems',
          title: 'Önnur vandamál',
          visible: true,
          items: [
            {
              id: '80',
              type: QuestionTypeEnum.String,
              label: 'Önnur vandamál',
              required: false,
              visible: true,
              multiline: true,
            } as HealthDirectorateQuestionDto,
          ],
        },
        {
          id: 'support-questions',
          title: 'Myndir þú vilja tala við einhvern um vandamál þín?',
          visible: true,
          items: [
            {
              id: '90',
              type: QuestionTypeEnum.List,
              label: 'Myndir þú vilja tala við einhvern um vandamál þín?',
              required: false,
              visible: true,
              multiselect: false,
              minSelections: 1,
              maxSelections: 1,
              values: [
                { id: '91', label: 'Já' },
                { id: '92', label: 'Nei' },
                { id: '93', label: 'Kannski' },
              ],
            } as HealthDirectorateQuestionDto,
            {
              id: '100',
              type: QuestionTypeEnum.List,
              label: 'Við hvern?',
              required: false,
              visible: true,
              multiselect: true,
              minSelections: 1,
              maxSelections: 1,
              values: [
                { id: '101', label: 'Hjúkrunarfræðing' },
                { id: '102', label: 'Næringarfræðing' },
                { id: '103', label: 'Lækni' },
                { id: '104', label: 'Sálfræðing' },
                { id: '105', label: 'Félagsráðgjafa' },
                { id: '106', label: 'Sjúkraþjálfara' },
                { id: '107', label: 'Prest eða djákna' },
                { id: '108', label: 'Sjúklingafélag' },
                { id: '109', label: 'Iðjuþjálfa' },
                { id: '110', label: 'Annan' },
              ],
            } as HealthDirectorateQuestionDto,
            {
              id: '120',
              type: QuestionTypeEnum.String,
              label: 'Hvern?',
              required: false,
              visible: true,
              multiline: false,
            } as HealthDirectorateQuestionDto,
          ],
        },
      ],
    }
  }

// Utility exports for working with visibility conditions
export {
  parseVisibilityCondition,
  createVisibilityCondition,
  serializeVisibilityCondition,
}
export type { VisibilityCondition }
