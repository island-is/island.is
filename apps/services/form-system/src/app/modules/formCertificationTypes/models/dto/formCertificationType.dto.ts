import { ApiProperty } from '@nestjs/swagger'

export class FormCertificationTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  certificationTypeId!: string
}
