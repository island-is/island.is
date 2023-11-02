import { IsArray, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'
import { HTMLText, ISODate, PlainText } from '@island.is/regulations'
import { AppendixModel } from '../../draft_regulation/models/appendix.model'

export class UpdateDraftRegulationChangeDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly date?: ISODate

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly title?: PlainText

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly text?: HTMLText

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [AppendixModel] })
  readonly appendixes?: AppendixModel[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly comments?: HTMLText

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly diff?: HTMLText
}
