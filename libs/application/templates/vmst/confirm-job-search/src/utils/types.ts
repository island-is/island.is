export type QuestionType = 'radio' | 'scale'

export type QuestionAnswer = {
  value: number
  textIS: string
  textEN: string
}

export type Question = {
  field: string
  order: number
  required: boolean
  questionIS: string
  questionEN: string
  type: QuestionType
  minValue: number | null
  maxValue: number | null
  answers: QuestionAnswer[]
}
