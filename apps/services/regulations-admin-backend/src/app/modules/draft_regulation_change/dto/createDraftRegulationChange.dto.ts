import { IsArray, IsDate, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { Appendix, HTMLText } from '@island.is/regulations'

export class CreateDraftRegulationChangeDto {
  @IsUUID()
  @ApiProperty()
  readonly changing_id!: string

  @IsString()
  @ApiProperty()
  readonly regulation!: string

  @IsDate()
  @ApiProperty()
  readonly date!: Date

  @IsString()
  @ApiProperty()
  readonly title!: string

  @IsString()
  @ApiProperty()
  readonly text!: string

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly appendixes?: Appendix[]

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comments?: HTMLText
}
