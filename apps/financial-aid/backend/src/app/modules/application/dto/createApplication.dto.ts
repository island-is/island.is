import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Application } from '@island.is/financial-aid/types'

export class CreateApplicationDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly phoneNumber: string


  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly email: string
}
