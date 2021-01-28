import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateOrganisationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  nationalId?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  email?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber?: string
}
