import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

export class SpouseEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly email: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly spouseName: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly spouseEmail: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly municipalityCode: string

  @IsNotEmpty()
  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  readonly created: Date

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicationSystemId: string
}
