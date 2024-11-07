import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFormCertificationTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  formId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  certificationTypeId!: string
}
