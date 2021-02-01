import { IsOptional, IsString, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateHelpdeskDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber?: string
}
