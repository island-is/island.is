import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFormUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  formId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationUrlId!: string
}
