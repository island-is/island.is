import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { Appendix, HTMLText, ISODate, PlainText } from '@island.is/regulations'

export class UpdateDraftRegulationChangeDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly date?: ISODate

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly title?: PlainText

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly text?: HTMLText

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly appendixes?: Appendix[]

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comments?: HTMLText

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly diff?: HTMLText
}
