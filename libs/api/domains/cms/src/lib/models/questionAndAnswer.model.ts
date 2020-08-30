import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Html, mapHtml } from './slices/html.model'
import { IQuestionAndAnswer } from '../generated/contentfulTypes'

@ObjectType()
export class QuestionAndAnswer {
  @Field(() => ID)
  id: string

  @Field()
  question: string

  @Field(() => Html)
  answer?: Html
}

export const mapQuestionAndAnswer = ({
  fields,
  sys,
}: IQuestionAndAnswer): QuestionAndAnswer => ({
  id: sys.id,
  question: fields.question,
  answer: fields.answer && mapHtml(fields.answer),
})
