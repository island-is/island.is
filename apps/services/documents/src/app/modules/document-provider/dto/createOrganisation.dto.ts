import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CreateContactDto } from './createContact.dto'

export class CreateOrganisationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address?: string

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneNumber?: string

  @IsOptional()
  @ApiProperty()
  administrativeContact?: CreateContactDto
}
