import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IFaqList } from '../generated/contentfulTypes'
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

  @CacheField(() => [QuestionAndAnswer])
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
