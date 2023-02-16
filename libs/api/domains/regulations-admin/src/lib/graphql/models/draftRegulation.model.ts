import { Field, ObjectType } from '@nestjs/graphql'
import {
  HTMLText,
  ISODate,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
  RegName,
  RegulationType,
} from '@island.is/regulations'

@ObjectType()
export class LawChapters {
  @Field(() => String)
  slug?: LawChapterSlug

  @Field(() => String)
  name?: string
}

@ObjectType()
export class Ministry {
  @Field(() => String)
  slug?: MinistrySlug

  @Field(() => String)
  name?: string
}

@ObjectType()
class Appendix {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText
}

@ObjectType()
class RegulationAuthor {
  @Field()
  authorId?: string

  @Field()
  name?: string
}

@ObjectType()
export class DraftRegulationModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  draftingStatus!: string

  @Field(() => String)
  draftingNotes!: string

  @Field(() => [RegulationAuthor])
  authors!: RegulationAuthor[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text?: HTMLText

  @Field(() => [Appendix], { nullable: true })
  appendixes!: Appendix[]

  @Field({ nullable: true })
  comments?: string

  @Field(() => String, { nullable: true })
  ministry!: MinistrySlug // name + slug

  @Field(() => [String], { nullable: true })
  lawChapters!: LawChapters[]

  @Field(() => [String], { nullable: true })
  impacts!: string[] // ?

  @Field(() => String, { nullable: true })
  name?: RegName

  @Field(() => String, { nullable: true })
  idealPublishDate?: ISODate

  @Field(() => String, { nullable: true })
  signatureDate?: ISODate

  @Field(() => String, { nullable: true })
  effectiveDate?: ISODate

  @Field(() => String)
  type!: RegulationType

  @Field(() => Boolean, { nullable: true })
  fastTrack?: boolean
}
