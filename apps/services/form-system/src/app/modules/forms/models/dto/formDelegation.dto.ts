import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FormDelegationDto {
  @ApiProperty()
  @IsString()
  formId!: string

  @ApiProperty()
  @IsString()
  delegation!: string
}
