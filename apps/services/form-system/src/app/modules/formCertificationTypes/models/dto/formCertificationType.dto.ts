import { ApiProperty } from '@nestjs/swagger'

export class FormCertificationTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  formId!: string

  @ApiProperty()
  certificationTypeId!: string
}
