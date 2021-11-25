import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateMunicipalityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly municipalityId: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  individualAidId: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  cohabitationAidId: string
}
