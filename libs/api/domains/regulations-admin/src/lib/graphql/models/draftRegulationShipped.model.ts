import { Field, ObjectType } from '@nestjs/graphql'
import { ISODate, PlainText, RegName } from '@island.is/regulations'

@ObjectType()
class RegulationShippedAuthor {
  @Field()
  authorId?: string

  @Field()
  name?: string
}

@ObjectType()
export class DraftRegulationShippedModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  draftingStatus!: string

  @Field(() => [RegulationShippedAuthor])
  authors!: RegulationShippedAuthor[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  name?: RegName

  @Field(() => String, { nullable: true })
  idealPublishDate?: ISODate

  @Field(() => Boolean, { nullable: true })
  fastTrack?: boolean
}
