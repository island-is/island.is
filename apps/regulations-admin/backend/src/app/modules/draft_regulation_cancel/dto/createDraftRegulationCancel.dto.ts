import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftRegulationCancelDto {
  @IsString()
  @ApiProperty()
  changing_id!: string

  @IsString()
  @ApiProperty()
  regulation!: string

  @IsDate()
  @ApiProperty()
  date!: string

  @IsDate()
  @ApiProperty()
  title!: string

  @IsDate()
  @ApiProperty()
  text!: string
}
