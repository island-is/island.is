import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationId!: string
}
