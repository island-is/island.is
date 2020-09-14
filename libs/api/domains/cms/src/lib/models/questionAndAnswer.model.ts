import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IQuestionAndAnswer } from '../generated/contentfulTypes'

import { Html, mapHtml } from './html.model'

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
