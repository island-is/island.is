import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IFaqList } from '../generated/contentfulTypes'

import {
  QuestionAndAnswer,
  mapQuestionAndAnswer,
} from './questionAndAnswer.model'

@ObjectType()
export class FaqList {
  constructor(initializer: FaqList) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [QuestionAndAnswer])
  questions: QuestionAndAnswer[]
}

export const mapFaqList = ({ fields, sys }: IFaqList): FaqList =>
  new FaqList({
    id: sys.id,
    title: fields.title,
    questions: (fields.questions ?? []).map(mapQuestionAndAnswer),
  })
