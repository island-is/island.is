import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteFormApplicantTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  formId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  applicantTypeId!: string
}
