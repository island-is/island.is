import { IsOptional, IsString, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateHelpdeskDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber?: string
}
