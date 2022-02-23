import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class MunicipalityQueryInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly id!: string
}
