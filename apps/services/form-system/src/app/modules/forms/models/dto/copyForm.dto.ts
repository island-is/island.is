import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CopyFormDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  organizationNationalId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  organizationId!: string
}
