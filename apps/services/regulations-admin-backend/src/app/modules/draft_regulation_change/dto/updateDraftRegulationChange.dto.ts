import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { Appendix, HTMLText } from '@island.is/regulations'

export class UpdateDraftRegulationChangeDto {
  @IsOptional()
  @IsDate()
  @ApiProperty()
  readonly date?: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly title?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly text?: string

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly appendixes?: Appendix[]

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comments?: HTMLText
}
