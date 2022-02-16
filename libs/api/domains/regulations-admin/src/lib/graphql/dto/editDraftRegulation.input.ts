import {
  HTMLText,
  ISODate,
  LawChapterSlug,
  PlainText,
  RegName,
  RegulationType,
  URLString,
} from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class Appendix {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText
}

@InputType()
export class EditDraftBody {
  @Field(() => String, { nullable: true })
  draftingStatus!: string

  @Field(() => String, { nullable: true })
  text!: HTMLText

  @Field(() => String, { nullable: true })
  comments?: HTMLText

  @Field(() => [Appendix], { nullable: true })
  appendixes?: Appendix[]

  @Field(() => String, { nullable: true })
  name?: RegName

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  draftingNotes!: HTMLText

  @Field(() => String, { nullable: true })
  ministry?: string

  @Field(() => Date, { nullable: true })
  idealPublishDate?: ISODate

  @Field(() => Date, { nullable: true })
  signatureDate?: ISODate

  @Field(() => String, { nullable: true })
  signatureText?: HTMLText

  @Field(() => Date, { nullable: true })
  effectiveDate?: ISODate

  @Field(() => String, { nullable: true })
  type?: RegulationType

  @Field()
  fastTrack?: boolean

  @Field(() => String, { nullable: true })
  signedDocumentUrl?: URLString

  @Field(() => [String], { nullable: true })
  lawChapters?: LawChapterSlug[]
}

@InputType()
export class EditDraftRegulationInput {
  @Field(() => String)
  id!: string

  @Field()
  body!: EditDraftBody
}
