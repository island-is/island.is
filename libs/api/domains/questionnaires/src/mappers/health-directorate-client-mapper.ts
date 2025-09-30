// Generic types until the health-directorate client exports are available
// See documentation from EL here:
// https://e-health-iceland.atlassian.net/wiki/spaces/RD/pages/1253670913/D+nam+skir+spurningalistar+-+XML+structure#%22Message%22-questions---%22type=text%22
interface HealthDirectorateQuestionnaireDetailDto {
  questionnaireId: string
  title?: string
  message?: string
  hint?: string
  numRepliesAllowed: number
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
  displayClass?: string
  // String/Text specific
  maxLength?: number
  multiline?: boolean
  _default?: string
  // Number specific
  min?: number
  max?: number

  minDescription?: string
  maxDescription?: string
  decimals?: boolean // If true, allows decimal numbers
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
      return AnswerOptionType.text
    case QuestionTypeEnum.Text: // If text, than it is a message to the user
      return AnswerOptionType.label
    case QuestionTypeEnum.Number:
      if (questionDto.displayClass === 'thermometer') {
        return AnswerOptionType.thermometer
      }
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
    case QuestionTypeEnum.String: {
      const stringQ = clientQuestion as HealthDirectorateQuestionDto
      answerOptions.placeholder = stringQ.hint || undefined
      answerOptions.maxLength = stringQ.maxLength || undefined
      break
    }
    case QuestionTypeEnum.Number: {
      const numberQ = clientQuestion as HealthDirectorateQuestionDto
      answerOptions.placeholder = numberQ.hint || undefined
      answerOptions.min = numberQ.min?.toString() || undefined
      answerOptions.max = numberQ.max?.toString() || undefined
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
  if (questionnaire.submissions.length > 0) {
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
export const createMockElPregnancyQuestionnaire =
  (): HealthDirectorateQuestionnaireDetailDto => {
    return {
      questionnaireId: '40ab0dfc-56a7-47d1-8030-b10cceb3ba76',
      title: 'Edinborgarkvarðinn: Spurningalisti um líðan kvenna á meðgöngu',
      numRepliesAllowed: 1,
      daysBetweenReplies: 0,
      canSubmit: false,
      submissions: [
        {
          id: '6df111d5-c84a-4081-91dd-2a435298c373',
          questionnaireId: '40ab0dfc-56a7-47d1-8030-b10cceb3ba76',
          isDraft: false,
          createdDate: '2025-08-25T11:40:52.000Z',
          lastUpdatedDate: '2025-08-25T11:40:52.000Z',
          submittedDate: '2025-08-25T11:40:52.000Z',
        },
      ],
      hasDraft: false,
      groups: [
        {
          title: 'Upplýsingar',
          items: [
            {
              id: '1119',
              label: 'Meðgöngulengd:',
              type: 'number',
              min: 0,
              decimals: true,
              htmlLabel: '',
            },
            {
              id: '16843',
              label: 'Hefur þú fætt barn áður:',
              type: 'bool',
              htmlLabel: '',
            },
          ],
        },
        {
          items: [
            {
              id: '17411',
              label:
                'Vinsamlegast krossaðu við það svar sem kemst næst því að lýsa hvernig þér leið síðustu 7 daga, ekki bara hvernig þér líður í dag.',
              type: 'text',
              htmlLabel:
                'Vinsamlegast krossaðu við það svar sem kemst næst því að lýsa hvernig þér leið <ins>síðustu 7 daga</ins>, ekki bara hvernig þér líður í dag.',
            },
            {
              id: '18928',
              label: 'Hér er dæmi þar sem svar hefur verið valið:',
              type: 'text',
              htmlLabel:
                'Hér er dæmi þar sem svar hefur verið valið:<br>Ég hef verið ánægð:<br>__ Já, alltaf<br><strong>X</strong> Já, oftast<br>__ Nei, sjaldan<br>__ Nei, alls ekki<br><br>Þetta svar þýðir <strong><em>Ég hef oftast verið ánægð síðustu vikuna</em></strong>. Vinsamlegast svarið eftirtöldum spurningum á sama hátt.',
            },
          ],
        },
        {
          title: 'HVERNIG HEFUR ÞÉR LIÐIÐ SÍÐUSTU 7 DAGA?',
          items: [
            {
              id: '1183',
              label:
                '1. Ég hef getað hlegið og séð spaugilegu hliðarnar á lífinu.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '11830',
                  label: 'Jafnmikið og ég er vön',
                },
                {
                  id: '11831',
                  label: 'Minna en ég er vön',
                },
                {
                  id: '11832',
                  label: 'Miklu minna en ég er vön',
                },
                {
                  id: '11833',
                  label: 'Alls ekki',
                },
              ],
            },
            {
              id: '2669',
              label: '2. Ég hef hlakkað til.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '26690',
                  label: 'Alveg jafnmikið og ég er vön',
                },
                {
                  id: '26691',
                  label: 'Minna en ég er vön',
                },
                {
                  id: '26692',
                  label: 'Töluvert minna en ég er vön',
                },
                {
                  id: '26693',
                  label: 'Eiginlega ekkert',
                },
              ],
            },
            {
              id: '3791',
              label:
                '3. Þegar hlutirnir ganga ekki nógu vel hef ég kennt sjálfri mér um það.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '37910',
                  label: 'Já, mjög oft',
                },
                {
                  id: '37911',
                  label: 'Já, stundum',
                },
                {
                  id: '37912',
                  label: 'Sjaldan',
                },
                {
                  id: '37913',
                  label: 'Nei, aldrei',
                },
              ],
            },
            {
              id: '4395',
              label: '4. Ég hef verið áhyggjufull eða kvíðin af litlu tilefni.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '43950',
                  label: 'Nei, alls ekki',
                },
                {
                  id: '43951',
                  label: 'Næstum aldrei',
                },
                {
                  id: '43952',
                  label: 'Já, stundum',
                },
                {
                  id: '43953',
                  label: 'Já, mjög oft',
                },
              ],
            },
            {
              id: '15363',
              label:
                '5. Ég hef verið hrædd eða skelfingu lostin af mjög litlu tilefni.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '153630',
                  label: 'Já, oft og mörgum sinnum',
                },
                {
                  id: '153631',
                  label: 'Já, stundum',
                },
                {
                  id: '153632',
                  label: 'Nei, sjaldan',
                },
                {
                  id: '153633',
                  label: 'Nei, alls ekki',
                },
              ],
            },
            {
              id: '25363',
              label:
                '6. Mér finnst ég eiga erfitt með að takast á við daglegt líf.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '253630',
                  label: 'Já, mér finnst ég alls ekki ráða við hlutina ',
                },
                {
                  id: '253631',
                  label:
                    'Já, stundum finnst mér ég ekki ráða jafnvel við hlutina og venjulega',
                },
                {
                  id: '253632',
                  label: 'Nei, oftast ræð ég við hlutina ',
                },
                {
                  id: '253633',
                  label: 'Nei, ég ræð jafnvel við hlutina og vanalega',
                },
              ],
            },
            {
              id: '35363',
              label:
                '7. Mér hefur liðið svo illa að ég hef átt erfitt með svefn.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '353630',
                  label: 'Já, oftast',
                },
                {
                  id: '353631',
                  label: 'Já, stundum ',
                },
                {
                  id: '353632',
                  label: 'Sjaldan',
                },
                {
                  id: '353633',
                  label: 'Nei, alls ekki',
                },
              ],
            },
            {
              id: '45363',
              label: '8. Ég hef verið döpur eða liðið ömurlega.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '453630',
                  label: 'Já, oftast',
                },
                {
                  id: '453631',
                  label: 'Já, frekar oft',
                },
                {
                  id: '453632',
                  label: 'Nei, sjaldan',
                },
                {
                  id: '453633',
                  label: 'Nei, aldrei',
                },
              ],
            },
            {
              id: '55363',
              label: '9. Ég hef grátið því mér hefur liðið svo illa.',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '553630',
                  label: 'Já, mjög oft',
                },
                {
                  id: '553631',
                  label: 'Já, frekar oft',
                },
                {
                  id: '553632',
                  label: 'Stöku sinnum',
                },
                {
                  id: '553633',
                  label: 'Nei, aldrei',
                },
              ],
            },
            {
              id: '65363',
              label: '10. Ég hef hugsað um að skaða sjálfa  mig',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '653630',
                  label: 'Já, frekar oft',
                },
                {
                  id: '653631',
                  label: 'Stundum',
                },
                {
                  id: '653632',
                  label: 'Næstum aldrei',
                },
                {
                  id: '653633',
                  label: 'Aldrei',
                },
              ],
            },
          ],
        },
        {
          title: 'Edinburgh Postnatal Depression Scale.',
          items: [
            {
              id: '1969',
              label: 'copyright',
              type: 'text',
              htmlLabel:
                '<span style="color: rgb(0,0,0);font-size: 15.4;font-family: sans-serif;">© </span>Höfundar: J.L. Cox, J.M.Holden og R. Sagovsky, R. Íslensk útgáfa: Marga Thome hjúkrunarfræðingur og ljósmóðir, Halldóra Ólafsdóttir geðlæknir og Pétur Tyrfingsson sálfræðingur.&nbsp;',
            },
          ],
        },
      ],
      triggers: {},
      replies: [],
    }
  }

/**
 * Creates a mock questionnaire based on the EL (Distress Thermometer) structure
 */
export const createMockElDistressThermometerQuestionnaire =
  (): HealthDirectorateQuestionnaireDetailDto => {
    return {
      questionnaireId: '8f7e2a1d-4c9b-4e3f-9a2d-6b8c4f5e1a3d',
      title: 'DT - Mat á vanlíðan',
      numRepliesAllowed: 1,
      daysBetweenReplies: 0,
      canSubmit: true,
      submissions: [],
      hasDraft: false,
      groups: [
        {
          items: [
            {
              maxDescription: 'Gríðarleg vanlíðan',
              minDescription: 'Engin vanlíðan',
              displayClass: 'thermometer',
              id: '10',
              label: 'Vanlíðan',
              required: true,
              type: 'number',
              min: 0,
              max: 10,
              decimals: false,
              htmlLabel:
                'Vinsamlegast merktu við þá tölu (0-10) sem lýsir því best hversu mikilli vanlíðan þú hefur fundið fyrir síðastliðna viku, að meðtöldum deginum í dag.',
            },
          ],
        },
        {
          items: [
            {
              id: '20',
              label:
                'Vinsamlegast merktu við hvort eitthvað af eftirtöldu hefur valdið þér erfiðleikum síðastliðna viku að meðtöldum deginum í dag. Gættu þess að merkja annað hvort við JÁ eða NEI í hverju atriði.',
              type: 'text',
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Almenn vandamál',
          items: [
            {
              id: '23',
              label: 'Barnagæsla',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '24',
              label: 'Húsnæði',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '25',
              label: 'Tryggingar',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '26',
              label: 'Fjármál',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '27',
              label: 'Ferðir',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '28',
              label: 'Vinna/Skóli',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '29',
              label: 'Ákvörðum um meðferð',
              type: 'bool',
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Fjölskylduvandi',
          items: [
            {
              id: '33',
              label: 'Vegna barna',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '34',
              label: 'Vegna maka',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '35',
              label: 'Heilsufar nákominna',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '36',
              label: 'Möguleikar á barneignum',
              type: 'bool',
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Tilfinningalegur vandi',
          items: [
            {
              id: '43',
              label: 'Þunglyndi',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '44',
              label: 'Ótti',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '45',
              label: 'Kvíði/taugaspenna',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '46',
              label: 'Depurð',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '47',
              label: 'Áhyggjur',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '48',
              label: 'Áhugaleysi á daglegum athöfnum',
              type: 'bool',
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Áhyggjur af andlegum/trúarlegum toga',
          items: [
            {
              id: '49',
              label: 'Áhyggjur af andlegum/trúarlegum toga',
              type: 'bool',
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Líkamleg vandamál',
          items: [
            {
              id: '53',
              label: 'Útlit',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '54',
              label: 'Að baðast/klæðast',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '55',
              label: 'Öndun',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '56',
              label: 'Breytingar á þvaglátum',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '57',
              label: 'Hægðatregða',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '58',
              label: 'Niðurgangur',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '59',
              label: 'Að borða',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '60',
              label: 'Þreyta',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '61',
              label: 'Bjúgur',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '62',
              label: 'Hitakóf',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '63',
              label: 'Að komast á milli staða',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '64',
              label: 'Meltingartruflanir',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '65',
              label: 'Minni/einbeiting',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '66',
              label: 'Sár í munni',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '67',
              label: 'Ógleði',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '68',
              label: 'Þurrkur eða stífla í nefi',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '69',
              label: 'Verkir',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '70',
              label: 'Kynlíf/samlíf',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '71',
              label: 'Húðþurrkur/kláði',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '72',
              label: 'Svefn',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '73',
              label: 'Áfengi, fíkniefni eða lyf',
              type: 'bool',
              htmlLabel: '',
            },
            {
              id: '74',
              label: 'Stingir í höndum/fótum',
              type: 'bool',
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Önnur vandamál',
          items: [
            {
              id: '80',
              label: 'Önnur vandamál',
              type: 'string',
              multiline: true,
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Myndir þú vilja tala við einhvern um vandamál þín?',
          items: [
            {
              id: '90',
              label: 'Myndir þú vilja tala við einhvern um vandamál þín?',
              type: 'list',
              multiselect: false,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '91',
                  label: 'Já',
                },
                {
                  id: '92',
                  label: 'Nei',
                },
                {
                  id: '93',
                  label: 'Kannski',
                },
              ],
            },
            {
              id: '100',
              label: 'Við hvern?',
              type: 'list',
              multiselect: true,
              htmlLabel: '',
              minSelections: 1,
              maxSelections: 1,
              values: [
                {
                  id: '101',
                  label: 'Hjúkrunarfræðing',
                },
                {
                  id: '102',
                  label: 'Næringarfræðing',
                },
                {
                  id: '103',
                  label: 'Lækni',
                },
                {
                  id: '104',
                  label: 'Sálfræðing',
                },
                {
                  id: '105',
                  label: 'Félagsráðgjafa',
                },
                {
                  id: '106',
                  label: 'Sjúkraþjálfara',
                },
                {
                  id: '107',
                  label: 'Prest eða djákna',
                },
                {
                  id: '108',
                  label: 'Sjúklingafélag',
                },
                {
                  id: '109',
                  label: 'Iðjuþjálfa',
                },
                {
                  id: '110',
                  label: 'Annan',
                },
              ],
            },
            {
              id: '120',
              label: 'Hvern?',
              type: 'string',
              multiline: false,
              htmlLabel: '',
            },
          ],
        },
        {
          title: 'Footer',
          items: [
            {
              id: '0',
              label: 'Copyright © NCCN National Comprehensive Cancer Network',
              type: 'text',
              htmlLabel: '',
            },
          ],
        },
      ],
      triggers: {
        '90': [
          {
            triggerId: '90',
            targetId: '100',
            visible: true,
            contains: ['91'],
            type: 'list',
          },
          {
            triggerId: '90',
            targetId: '100',
            visible: false,
            type: 'list',
          },
          {
            triggerId: '90',
            targetId: '120',
            visible: false,
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
          {
            triggerId: '100',
            targetId: '120',
            visible: false,
            type: 'list',
          },
        ],
      },
      replies: [],
    }
  }

// Utility exports for working with visibility conditions
export {
  parseVisibilityCondition,
  createVisibilityCondition,
  serializeVisibilityCondition,
}
export type { VisibilityCondition }
