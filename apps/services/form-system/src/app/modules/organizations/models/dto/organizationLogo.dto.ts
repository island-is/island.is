import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUrl, Matches, ValidateIf } from 'class-validator'

export class OrganizationLogoDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\d{10}$/)
  nationalId!: string

  @ApiProperty()
  @ValidateIf((_object, value: unknown) => value !== '')
  @IsUrl()
  logo!: string
}
