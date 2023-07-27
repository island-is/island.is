import { IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { ISODate, RegName } from '@island.is/regulations'

export class CreateDraftRegulationCancelDto {
  @IsUUID()
  @ApiProperty()
  changingId!: string

  @IsString()
  @ApiProperty()
  regulation!: RegName

  @IsString()
  @ApiProperty()
  date!: ISODate
}
