import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftAuthorDto {
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
