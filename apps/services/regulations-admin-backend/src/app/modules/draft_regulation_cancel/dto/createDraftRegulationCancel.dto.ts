import { IsDate, IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateDraftRegulationCancelDto {
  @IsUUID()
  @ApiProperty()
  changing_id!: string

  @IsString()
  @ApiProperty()
  regulation!: string

  @IsDate()
  @ApiProperty()
  date!: Date
}
