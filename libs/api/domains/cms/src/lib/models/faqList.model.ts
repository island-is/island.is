import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IFaqList } from '../generated/contentfulTypes'

import {
  QuestionAndAnswer,
  mapQuestionAndAnswer,
} from './questionAndAnswer.model'

@ObjectType()
export class FaqList {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [QuestionAndAnswer])
  questions: QuestionAndAnswer[]
}

export const mapFaqList = ({ fields, sys }: IFaqList): FaqList => ({
  typename: 'FaqList',
  id: sys.id,
  title: fields.title,
  questions: (fields.questions ?? []).map(mapQuestionAndAnswer),
})
