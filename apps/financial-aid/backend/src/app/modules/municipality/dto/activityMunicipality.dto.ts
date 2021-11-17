import { IsBoolean, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class ActivityMunicipalityDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly active?: boolean
}
