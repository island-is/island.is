import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { AidType } from '@island.is/financial-aid/shared/lib'

export class CreateAidDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly municipalityId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly type!: AidType
}
