import {
  QuestionnaireAnswerOptionType,
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
} from '@island.is/api/schema'
import {
  GetQuestionnaireQuery,
  GetQuestionnaireWithQuestionsQuery,
  GetQuestionnairesQuery,
} from './questionnaires.generated'

// DEV ONLY: hardcoded questionnaires for checking the scale question UI
// with and without section dividers. Remove before merging.

type ListItem = NonNullable<
  NonNullable<GetQuestionnairesQuery['questionnairesList']>['questionnaires']
>[number]
type Detail = NonNullable<GetQuestionnaireQuery['questionnairesDetail']>
type DetailWithQuestions = NonNullable<
  GetQuestionnaireWithQuestionsQuery['questionnairesDetail']
>
type Section = NonNullable<DetailWithQuestions['sections']>[number]
type Question = NonNullable<Section['questions']>[number]
type AnswerOptions = Question['answerOptions']

const MOCK_PREFIX = 'mock-scale-'
const SENT_DATE = '2026-09-21T09:00:00.000Z'

export const isMockQuestionnaire = (id?: string) =>
  !!id && id.startsWith(MOCK_PREFIX)

const answerOptions = (
  partial: Partial<AnswerOptions> & Pick<AnswerOptions, 'type'>,
): AnswerOptions => ({
  __typename: 'QuestionnaireAnswerOption',
  ...partial,
})

const option = (value: string, label: string) => ({
  __typename: 'QuestionnaireOptionsLabelValue' as const,
  id: value,
  label,
  value,
})

const question = (
  id: string,
  label: string,
  options: AnswerOptions,
  extra?: Partial<Question>,
): Question => ({
  __typename: 'QuestionnaireQuestion',
  id,
  label,
  answerOptions: options,
  ...extra,
})

const painScale = (id: string, label: string, extra?: Partial<Question>) =>
  question(
    id,
    label,
    answerOptions({
      type: QuestionnaireAnswerOptionType.scale,
      min: '0',
      max: '10',
      minLabel: 'Engir verkir',
      maxLabel: 'Gríðarlegir verkir',
    }),
    extra,
  )

const questions: Question[] = [
  painScale('q1', 'Styrkur verkja að jafnaði síðasta sólarhringinn', {
    required: true,
  }),
  painScale('q2', 'Styrkur minnstu verkja síðasta sólarhringinn', {
    htmlLabel: 'Styrkur <u>minnstu</u> verkja síðasta sólarhringinn',
  }),
  painScale('q3', 'Styrkur verstu verkja síðasta sólarhringinn', {
    htmlLabel: 'Styrkur <u>verstu</u> verkja síðasta sólarhringinn',
    sublabel: 'Miðaðu við sársaukafyllsta augnablik sólarhringsins.',
  }),
  question(
    'q4',
    'Hversu mikil áhrif hafa verkirnir haft á daglegt líf?',
    answerOptions({
      type: QuestionnaireAnswerOptionType.thermometer,
      min: '0',
      max: '10',
      minLabel: 'Engin áhrif',
      maxLabel: 'Mjög mikil áhrif',
    }),
  ),
  question(
    'q5',
    'Hefur þú tekið verkjalyf síðasta sólarhringinn?',
    answerOptions({
      type: QuestionnaireAnswerOptionType.radio,
      options: [option('yes', 'Já'), option('no', 'Nei')],
    }),
  ),
  question(
    'q6',
    'Hvernig var svefninn síðustu nótt?',
    answerOptions({
      type: QuestionnaireAnswerOptionType.radio,
      options: [
        option('great', 'Mjög góður'),
        option('good', 'Góður'),
        option('fair', 'Sæmilegur'),
        option('bad', 'Slæmur'),
      ],
    }),
  ),
  painScale('q7', 'Styrkur verkja núna, á meðan þú svarar'),
  question(
    'q8',
    'Annað sem þú vilt koma á framfæri?',
    answerOptions({
      type: QuestionnaireAnswerOptionType.textarea,
      placeholder: 'Skrifaðu hér',
      maxLength: '500',
    }),
  ),
]

const section = (
  id: string,
  sectionQuestions: Question[],
  title?: string,
): Section => ({
  __typename: 'QuestionnaireSection',
  id,
  title,
  questions: sectionQuestions,
})

const mocks: Array<{
  id: string
  title: string
  description: string
  sections: Section[]
}> = [
  {
    id: `${MOCK_PREFIX}single`,
    title: 'Mat á árangri meðferðar - einn kafli',
    description:
      'Prufulisti: allar spurningar í einum kafla, engin skil á milli.',
    sections: [section('s1', questions)],
  },
  {
    id: `${MOCK_PREFIX}sections`,
    title: 'Mat á árangri meðferðar - kafli á spurningu',
    description: 'Prufulisti: hver spurning í sínum kafla, skil á milli allra.',
    sections: questions.map((q, index) => section(`s${index + 1}`, [q])),
  },
  {
    id: `${MOCK_PREFIX}mixed`,
    title: 'Mat á árangri meðferðar - blandað',
    description:
      'Prufulisti: tveir kaflar með fyrirsögn og nokkrum spurningum hvor.',
    sections: [
      section('s1', questions.slice(0, 4), 'Verkir'),
      section('s2', questions.slice(4), 'Líðan'),
    ],
  },
]

export const mockQuestionnaireList: ListItem[] = mocks.map((mock) => ({
  __typename: 'QuestionnairesBaseItem',
  id: mock.id,
  title: mock.title,
  description: mock.description,
  sentDate: SENT_DATE,
  status: QuestionnaireQuestionnairesStatusEnum.notAnswered,
  organization: QuestionnaireQuestionnairesOrganizationEnum.EL,
  senderGroupName: 'Prufugögn',
}))

export const getMockQuestionnaire = (id?: string): Detail | undefined => {
  const mock = mocks.find((m) => m.id === id)
  if (!mock) return undefined
  return {
    __typename: 'QuestionnaireDetail',
    baseInformation: {
      __typename: 'QuestionnairesBaseItem',
      id: mock.id,
      title: mock.title,
      description: mock.description,
      sentDate: SENT_DATE,
      status: QuestionnaireQuestionnairesStatusEnum.notAnswered,
      organization: QuestionnaireQuestionnairesOrganizationEnum.EL,
      senderGroupName: 'Prufugögn',
    },
    sender: 'Prufugögn',
    canSubmit: true,
    submissions: [],
  }
}

export const getMockQuestionnaireWithQuestions = (
  id?: string,
): DetailWithQuestions | undefined => {
  const mock = mocks.find((m) => m.id === id)
  if (!mock) return undefined
  return {
    __typename: 'QuestionnaireDetail',
    baseInformation: {
      __typename: 'QuestionnairesBaseItem',
      id: mock.id,
      title: mock.title,
      organization: QuestionnaireQuestionnairesOrganizationEnum.EL,
      sentDate: SENT_DATE,
      formId: `${mock.id}-form`,
    },
    canSubmit: true,
    draftAnswers: [],
    sections: mock.sections,
  }
}
