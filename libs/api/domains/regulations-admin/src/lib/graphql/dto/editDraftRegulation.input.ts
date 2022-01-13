import {
  HTMLText,
  ISODate,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
  RegName,
  RegulationType,
  URLString,
} from '@island.is/regulations'
import { DraftingStatus } from '@island.is/regulations/admin'
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'
import { Appendix } from '../models/draftRegulation.model'

@InputType()
export class EditDraftBody {
  @IsString()
  @Field(() => String, { nullable: true })
  draftingStatus!: DraftingStatus

  @IsString()
  @Field(() => String, { nullable: true })
  text!: HTMLText

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional()
  comments?: HTMLText

  @Field(() => [Appendix], { nullable: true })
  @IsOptional()
  appendixes?: Appendix[]

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: RegName

  @IsString()
  @Field(() => String, { nullable: true })
  title!: PlainText

  @IsString()
  @Field(() => String, { nullable: true })
  draftingNotes!: HTMLText

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional()
  ministryId?: MinistrySlug

  @IsString()
  @Field(() => Date, { nullable: true })
  @IsOptional()
  idealPublishDate?: ISODate

  @IsString()
  @Field(() => Date, { nullable: true })
  @IsOptional()
  signatureDate?: ISODate

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional()
  signatureText?: HTMLText

  @IsString()
  @Field(() => Date, { nullable: true })
  @IsOptional()
  effectiveDate?: ISODate

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional()
  type?: RegulationType

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional()
  signedDocumentUrl?: URLString

  @Field(() => [String], { nullable: true })
  @IsOptional()
  lawChapters?: LawChapterSlug[]
}

@InputType()
export class EditDraftRegulationInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  body!: EditDraftBody
}
