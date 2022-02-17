import { IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { ISODate } from '@island.is/regulations'

export class CreateDraftRegulationCancelDto {
  @IsUUID()
  @ApiProperty()
  changing_id!: string

  @IsString()
  @ApiProperty()
  regulation!: string

  @IsString()
  @ApiProperty()
  date!: ISODate
}
