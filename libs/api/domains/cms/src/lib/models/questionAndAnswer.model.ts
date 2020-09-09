import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IQuestionAndAnswer } from '../generated/contentfulTypes'

import { Html, isHtml } from './slices/html.model'
import { mapRichText } from './slices/richText.model'

@ObjectType()
export class QuestionAndAnswer {
  @Field(() => ID)
  id: string

  @Field()
  question: string

  // TODO
  @Field(() => Html)
  answer?: Html
}

export const mapQuestionAndAnswer = ({
  fields,
  sys,
}: IQuestionAndAnswer): QuestionAndAnswer => ({
  id: sys.id,
  question: fields.question,
  answer: fields.answer && mapRichText(fields.answer).filter(isHtml),
})
