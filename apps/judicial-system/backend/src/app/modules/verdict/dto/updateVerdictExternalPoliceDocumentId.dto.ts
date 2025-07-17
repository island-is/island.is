import { IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateVerdictExternalPoliceDocumentIdDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: Object })
  readonly externalPoliceDocumentId!: string
}
