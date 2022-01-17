import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import {
  Appendix,
  HTMLText,
  ISODate,
  Kennitala,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
  RegName,
  RegulationType,
  URLString,
} from '@island.is/regulations'
import { DraftingStatus } from '@island.is/regulations/admin'

export class UpdateDraftRegulationDto {
  @IsString()
  @ApiProperty()
  readonly draftingStatus!: DraftingStatus

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly name?: RegName

  @IsString()
  @ApiProperty()
  readonly title!: PlainText

  @IsString()
  @ApiProperty()
  readonly text!: HTMLText

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly appendixes?: Appendix[]

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comments?: HTMLText

  @IsString()
  @ApiProperty()
  readonly draftingNotes!: HTMLText

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly idealPublishDate?: ISODate

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly ministryId?: MinistrySlug

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly signatureDate?: ISODate

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly signatureText?: HTMLText

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly effectiveDate?: ISODate

  @IsString()
  @ApiProperty()
  readonly type!: RegulationType

  @IsOptional()
  @IsArray()
  @ApiProperty()
  authors?: Kennitala[]

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly signedDocumentUrl?: URLString

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly lawChapters?: LawChapterSlug[]

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly fastTrack?: boolean
}
