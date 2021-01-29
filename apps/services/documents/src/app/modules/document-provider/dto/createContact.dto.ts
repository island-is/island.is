import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber?: string
}
