import { Field, ObjectType } from '@nestjs/graphql'
import { DraftingStatus, RegulationDraftId } from '@island.is/regulations/admin'
import { PlainText } from '@island.is/regulations'
import { RegulationAuthor } from './draftRegulation.model'
// import { ISODate } from '@island.is/regulations'

@ObjectType()
export class DraftRegulationSummaryModel {
  @Field(() => String)
  id!: RegulationDraftId

  @Field(() => String)
  draftingStatus!: DraftingStatus

  @Field(() => [RegulationAuthor])
  authors!: RegulationAuthor[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => Date, { nullable: true })
  idealPublishDate?: string

  @Field(() => Boolean, { nullable: true })
  fastTrack?: boolean
}
