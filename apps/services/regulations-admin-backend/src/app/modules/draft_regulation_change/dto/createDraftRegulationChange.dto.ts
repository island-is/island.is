import { IsArray, IsDate, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import {
  Appendix,
  HTMLText,
  ISODate,
  PlainText,
  RegName,
} from '@island.is/regulations'

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
