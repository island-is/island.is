export enum OptionsValueEnum {
  NONE = 'NONE',
  LITTLE = 'LITTLE',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  EXTREME = 'EXTREME',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  REFUSE_TO_ANSWER = 'REFUSE_TO_ANSWER',
}

type QuestionOption = {
  title: string
  value: OptionsValueEnum
}

export const questionOptions: Array<QuestionOption> = [
  {
    title: 'Enginn vandi',
    value: OptionsValueEnum.NONE,
  },
  {
    title: 'Vægur vandi',
    value: OptionsValueEnum.LITTLE,
  },
  {
    title: 'Miðlungs vandi',
    value: OptionsValueEnum.MODERATE,
  },
  {
    title: 'Mikill vandi',
    value: OptionsValueEnum.SEVERE,
  },
  {
    title: 'Algjör vandi',
    value: OptionsValueEnum.EXTREME,
  },
  {
    title: 'Á ekki við',
    value: OptionsValueEnum.NOT_APPLICABLE,
  },
  {
    title: 'Get/vil ekki svara',
    value: OptionsValueEnum.REFUSE_TO_ANSWER,
  },
]

export type Question = {
  id: string
  label: string
  options: Array<QuestionOption>
}

export const MOCK_QUESTIONS: Array<Question> = [
  {
    id: '1',
    label:
      'Í hversu miklum vanda átt þú að læra nýja hluti og tileinka þér þekkingu (t.d. læra á tölvu, læra að nota ný verkfæri o.s.frv.)',
  },
  {
    id: '2',
    label:
      'Í hversu miklum vanda átt þú með að viðhalda einbeitingu í tilteknum verkefnum þrátt fyrir truflanir?',
  },
  {
    id: '3',
    label: 'Question 3',
  },
  {
    id: '4',
    label: 'Question 4',
  },
  {
    id: '5',
    label: 'Question 5',
  },
  {
    id: '6',
    label: 'Question 6',
  },
  {
    id: '7',
    label: 'Question 7',
  },
  {
    id: '8',
    label: 'Question 8',
  },
  {
    id: '9',
    label: 'Question 9',
  },
  {
    id: '10',
    label: 'Question 10',
  },
].map((question) => ({ ...question, options: questionOptions }))
