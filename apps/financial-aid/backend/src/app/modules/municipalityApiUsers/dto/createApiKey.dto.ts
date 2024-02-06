import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly apiKey: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  municipalityCode: string
}
