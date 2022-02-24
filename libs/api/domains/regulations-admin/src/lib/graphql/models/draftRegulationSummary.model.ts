import { Field, ObjectType } from '@nestjs/graphql'
import { ISODate, PlainText, RegName } from '@island.is/regulations'

@ObjectType()
class RegulationSummaryAuthor {
  @Field()
  authorId?: string

  @Field()
  name?: string
}

@ObjectType()
class DraftRegulationPagingModel {
  @Field()
  page?: number

  @Field()
  pages?: number
}

@ObjectType()
class DraftRegulationSummary {
  @Field(() => String)
  id!: string

  @Field(() => String)
  draftingStatus!: string

  @Field(() => [RegulationSummaryAuthor])
  authors!: RegulationSummaryAuthor[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  name?: RegName

  @Field(() => String, { nullable: true })
  idealPublishDate?: ISODate

  @Field(() => Boolean, { nullable: true })
  fastTrack?: boolean
}

@ObjectType()
export class DraftRegulationSummaryModel {
  @Field(() => [DraftRegulationSummary])
  drafts?: DraftRegulationSummary[]

  @Field()
  paging?: DraftRegulationPagingModel
}
