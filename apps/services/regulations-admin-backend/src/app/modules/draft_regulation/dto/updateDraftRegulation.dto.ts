import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Appendix,
  HTMLText,
  ISODate,
  Kennitala,
  LawChapterSlug,
  PlainText,
  RegName,
  RegulationType,
  URLString,
} from '@island.is/regulations'
import { AppendixModel } from '../models/appendix.model'

export class UpdateDraftRegulationDto {
  @IsString()
  @ApiProperty()
  readonly draftingStatus!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly name?: RegName

  @IsString()
  @ApiProperty()
  readonly title!: PlainText

  @IsString()
  @ApiProperty()
  readonly text!: HTMLText

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [AppendixModel] })
  readonly appendixes?: AppendixModel[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly comments?: HTMLText

  @IsString()
  @ApiProperty()
  readonly draftingNotes!: HTMLText

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly idealPublishDate?: ISODate

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly ministry?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly signatureDate?: ISODate

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly signatureText?: HTMLText

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly effectiveDate?: ISODate

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly type?: RegulationType

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  authors?: Kennitala[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly signedDocumentUrl?: URLString

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  readonly lawChapters?: LawChapterSlug[]

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly fastTrack?: boolean
}
