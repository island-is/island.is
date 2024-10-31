import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
// import { ApplicantTypes } from '../../../../enums/applicantTypes'

export class CreateFormApplicantDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  formId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  applicantTypeId!: string
}
