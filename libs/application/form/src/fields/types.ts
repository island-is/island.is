import { Answers, Field } from '@island.is/application/schema'

export interface FieldBaseProps {
  field: Field
  answers: Answers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answerQuestion: (a: { id: string; answer: any }) => void
  showFieldName?: boolean
}
