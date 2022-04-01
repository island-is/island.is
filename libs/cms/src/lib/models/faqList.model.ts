import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IFaqList } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import {
  QuestionAndAnswer,
  mapQuestionAndAnswer,
} from './questionAndAnswer.model'

@ObjectType()
export class FaqList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => [QuestionAndAnswer])
  questions?: QuestionAndAnswer[]

  @Field(() => Boolean, { nullable: true })
  showTitle?: boolean
}

export const mapFaqList = ({
  fields,
  sys,
}: IFaqList): SystemMetadata<FaqList> => ({
  typename: 'FaqList',
  id: sys.id,
  title: fields.title ?? '',
  questions: (fields.questions ?? []).map(mapQuestionAndAnswer),
  showTitle: fields.showTitle ?? true,
})
