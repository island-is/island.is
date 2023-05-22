import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { HTMLText, ISODate, PlainText, RegName } from '@island.is/regulations'
import { AppendixModel } from '../../draft_regulation/models/appendix.model'

export class CreateDraftRegulationChangeDto {
  @IsUUID()
  @ApiProperty()
  readonly changingId!: string

  @IsString()
  @ApiProperty()
  readonly regulation!: RegName

  @IsString()
  @ApiProperty()
  readonly date!: ISODate

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

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly diff?: HTMLText
}
