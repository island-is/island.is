import { IsNotEmpty, IsString, IsBoolean } from 'class-validator'

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
}
