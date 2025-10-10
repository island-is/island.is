/* eslint-disable func-style */
/**
 * Health Directorate Questionnaire Mapper - Transforms Health Directorate API Form objects into the internal Questionnaire format.
 */

import {
  AnswerOptionType,
  Question,
  QuestionDisplayType,
  VisibilityCondition,
  VisibilityOperator,
} from '../../../models/question.model'
import {
  Questionnaire,
  QuestionnaireSection,
  QuestionnairesList,
  QuestionnairesStatusEnum,
} from '../../../models/questionnaires.model'

interface ExternalItemValue {
  id: string
  label: string
}

interface ExternalItem {
  id: string
  label: string
  type: string
  minDescription?: string
  maxDescription?: string
  required?: boolean
  minSelections?: number
  maxSelections?: number
  displayClass?: string
  min?: number
  max?: number
  decimals?: boolean
  multiline?: boolean
  values?: ExternalItemValue[]
  multiselect?: boolean
  htmlLabel?: string
}

interface ExternalGroup {
  title?: string
  items: ExternalItem[]
}

interface ExternalTrigger {
  triggerId: string
  targetId: string
  visible: boolean
  contains?: string[]
  type?: string
}

interface ExternalQuestionnaire {
  questionnaireId: string
  title: string
  numRepliesAllowed: number
  daysBetweenReplies: number
  canSubmit: boolean
  submissions: Record<string, unknown>[]
  hasDraft: boolean
  replies: Record<string, unknown>[]
  groups: ExternalGroup[]
  triggers?: Record<string, ExternalTrigger[]>
}

/* -------------------- Helper Functions -------------------- */

function mapAnswerType(type: string, item: ExternalItem): AnswerOptionType {
  switch (type) {
    case 'text':
      return AnswerOptionType.label
    case 'string':
      return AnswerOptionType.text
    case 'number':
      if (item.displayClass === 'thermometer')
        return AnswerOptionType.thermometer
      return AnswerOptionType.number
    case 'bool':
      // Boolean questions are typically yes/no radio buttons
      return AnswerOptionType.radio
    case 'list':
      return item.multiselect
        ? AnswerOptionType.checkbox
        : AnswerOptionType.radio
    case 'thermometer':
      return AnswerOptionType.thermometer
    default:
      return AnswerOptionType.text
  }
}

function mapTriggers(
  allQuestions: ExternalItem[],
  triggers: Record<string, ExternalTrigger[]> | undefined,
  itemId: string,
): { dependsOn?: string[]; visibilityConditions?: VisibilityCondition[] } {
  if (!triggers) return {}

  // Find all triggers where this itemId is the targetId
  const relevantTriggers: ExternalTrigger[] = []

  Object.entries(triggers).forEach(([_triggerKey, triggerList]) => {
    triggerList.forEach((trigger) => {
      if (trigger.targetId === itemId) {
        relevantTriggers.push(trigger)
      }
    })
  })

  if (relevantTriggers.length === 0) return {}

  const conditions: VisibilityCondition[] = []
  const dependsOnSet = new Set<string>()

  // Group triggers by triggerId to handle show/hide logic correctly
  const triggerGroups = new Map<string, ExternalTrigger[]>()

  relevantTriggers.forEach((trigger) => {
    dependsOnSet.add(trigger.triggerId)

    if (!triggerGroups.has(trigger.triggerId)) {
      triggerGroups.set(trigger.triggerId, [])
    }
    const group = triggerGroups.get(trigger.triggerId)
    if (group) {
      group.push(trigger)
    }
  })

  // Process each trigger group to create proper visibility conditions
  triggerGroups.forEach((triggers, triggerId) => {
    // Find the trigger with specific contains values (the positive condition)
    const showTrigger = triggers.find((t) => t.visible && t.contains?.length)

    if (showTrigger && showTrigger.contains?.length) {
      // Map the contains IDs to their actual option IDs (not labels)
      const expectedValues = showTrigger.contains.map((containsId) => {
        const sourceQuestion = allQuestions.find((q) => q.id === triggerId)
        if (sourceQuestion?.values) {
          const option = sourceQuestion.values.find((v) => v.id === containsId)
          return option?.id || containsId
        }
        return containsId
      })

      // Create a condition that shows the question only when specific values are selected
      conditions.push({
        questionId: triggerId,
        operator: VisibilityOperator.equals,
        expectedValues,
        showWhenMatched: true,
      })
    } else {
      // If no specific show condition, check for general visibility
      const visibleTrigger = triggers.find((t) => t.visible)
      if (visibleTrigger) {
        conditions.push({
          questionId: triggerId,
          operator: VisibilityOperator.exists,
          expectedValues: undefined,
          showWhenMatched: true,
        })
      }
    }
  })

  // Remove duplicate conditions (same questionId and expectedValues)
  const uniqueConditions = conditions.filter((condition, index, array) => {
    return (
      array.findIndex(
        (c) =>
          c.questionId === condition.questionId &&
          JSON.stringify(c.expectedValues) ===
            JSON.stringify(condition.expectedValues),
      ) === index
    )
  })

  return {
    dependsOn: Array.from(dependsOnSet),
    visibilityConditions:
      uniqueConditions.length > 0 ? uniqueConditions : undefined,
  }
}

function mapItemToQuestion(
  item: ExternalItem,
  allQuestions: ExternalItem[],
  triggers?: Record<string, ExternalTrigger[]>,
): Question {
  const answerType = mapAnswerType(item.type, item)
  const triggerDeps = mapTriggers(allQuestions, triggers, item.id)

  // Handle options based on question type
  let options: Array<{ label: string; value: string }> | undefined

  if (item.type === 'bool') {
    // Boolean questions get Yes/No options
    options = [
      { label: 'Já', value: 'true' },
      { label: 'Nei', value: 'false' },
    ]
  } else if (item.values) {
    // List questions use provided values
    options = item.values.map((v) => ({ label: v.label, value: v.id }))
  }

  const answerOptions = {
    id: item.id,
    type: answerType,
    display: item.required
      ? QuestionDisplayType.required
      : QuestionDisplayType.optional,
    label: undefined,
    options,
    placeholder: item.htmlLabel,
    min: item.min?.toString(),
    max: item.max?.toString(),
    minLabel: item.minDescription,
    maxLabel: item.maxDescription,
    multiline: item.multiline || undefined,
  }

  return {
    id: item.id,
    label: item.label,
    sublabel: item.htmlLabel,
    display: item.required
      ? QuestionDisplayType.required
      : QuestionDisplayType.optional,
    answerOptions,
    ...triggerDeps,
  }
}

function mapGroupToSection(
  group: ExternalGroup,
  allQuestions: ExternalItem[],
  triggers?: Record<string, ExternalTrigger[]>,
): QuestionnaireSection {
  return {
    sectionTitle: group.title,
    questions: group.items.map((item) =>
      mapItemToQuestion(item, allQuestions, triggers),
    ),
  }
}

/* -------------------- Core Mapper -------------------- */

export function mapExternalQuestionnaireToGraphQL(
  q: ExternalQuestionnaire,
): Questionnaire {
  const allQuestions: ExternalItem[] = q.groups.flatMap((g) => g.items)

  return {
    id: q.questionnaireId,
    title: q.title,
    sentDate: new Date().toISOString(),
    sections: q.groups.map((g) =>
      mapGroupToSection(g, allQuestions, q.triggers),
    ),
    description: undefined,
    status:
      q.submissions.length > 0
        ? QuestionnairesStatusEnum.answered
        : QuestionnairesStatusEnum.notAnswered,
    organization: undefined,
  }
}

export function mapExternalQuestionnairesToList(
  external: ExternalQuestionnaire[],
): QuestionnairesList {
  return {
    questionnaires: external.map(mapExternalQuestionnaireToGraphQL),
  }
}

/* -------------------- MOCKS -------------------- */

/**
 * Helper function to create a mock questionnaire for testing
 */
export const createMockElPregnancyQuestionnaire = (): ExternalQuestionnaire => {
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
  (): ExternalQuestionnaire => {
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
