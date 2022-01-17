import { Field, ObjectType } from '@nestjs/graphql'
import { DraftingStatus, RegulationDraftId } from '@island.is/regulations/admin'
import {
  HTMLText,
  ISODate,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
  RegName,
  RegulationType,
} from '@island.is/regulations'
// import { ISODate } from '@island.is/regulations'

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
export class Appendix {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText
}

@ObjectType()
export class RegulationAuthor {
  @Field()
  authorId?: string

  @Field()
  name?: string

  @Field()
  email?: string
}

@ObjectType()
export class DraftRegulationModel {
  @Field(() => String)
  id!: RegulationDraftId

  @Field(() => String)
  draftingStatus!: DraftingStatus

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

  @Field(() => Date, { nullable: true })
  idealPublishDate?: string

  @Field(() => Date, { nullable: true })
  signatureDate?: ISODate

  @Field(() => Date, { nullable: true })
  effectiveDate?: ISODate

  @Field(() => String)
  type!: RegulationType
}
