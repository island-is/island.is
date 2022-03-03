import { ApiProperty } from '@nestjs/swagger'
import { IsEmail,IsNotEmpty, IsOptional, IsString } from 'class-validator'

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
