import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftRegulationChangeDto {
  @IsUUID()
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
