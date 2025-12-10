import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateOrganizationUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationNationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  method!: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isTest!: boolean
}
