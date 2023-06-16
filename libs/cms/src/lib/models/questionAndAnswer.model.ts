import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IQuestionAndAnswer } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class QuestionAndAnswer {
  @Field(() => ID)
  id!: string

  @Field()
  question!: string

  @CacheField(() => [SliceUnion])
  answer: Array<typeof SliceUnion> = []

  @Field({ nullable: true })
  publishDate?: string
}

export const mapQuestionAndAnswer = ({
  fields,
  sys,
}: IQuestionAndAnswer): QuestionAndAnswer => ({
  id: sys.id,
  question: fields.question ?? '',
  answer: fields.answer ? mapDocument(fields.answer, sys.id + ':answer') : [],
  publishDate: fields.publishDate ?? '',
})
