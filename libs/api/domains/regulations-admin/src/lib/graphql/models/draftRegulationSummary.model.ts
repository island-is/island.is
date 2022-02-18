import { Field, ObjectType } from '@nestjs/graphql'
import { DraftingStatus } from '@island.is/regulations/admin'
import { PlainText } from '@island.is/regulations'

@ObjectType()
class RegulationSummaryAuthor {
  @Field()
  authorId?: string

  @Field()
  name?: string
}

@ObjectType()
export class DraftRegulationSummaryModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  draftingStatus!: DraftingStatus

  @Field(() => [RegulationSummaryAuthor])
  authors!: RegulationSummaryAuthor[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => Date, { nullable: true })
  idealPublishDate?: string

  @Field(() => Boolean, { nullable: true })
  fastTrack?: boolean
}
