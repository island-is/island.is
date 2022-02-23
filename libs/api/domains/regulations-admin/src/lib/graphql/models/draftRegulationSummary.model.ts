import { Field, ObjectType } from '@nestjs/graphql'
import { ISODate, PlainText } from '@island.is/regulations'

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
  draftingStatus!: string

  @Field(() => [RegulationSummaryAuthor])
  authors!: RegulationSummaryAuthor[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  idealPublishDate?: ISODate

  @Field(() => Boolean, { nullable: true })
  fastTrack?: boolean
}
