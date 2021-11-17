import { IsBoolean, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class MunicipalityActivityDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly active: boolean
}
