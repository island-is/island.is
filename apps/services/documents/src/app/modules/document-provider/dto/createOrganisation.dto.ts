import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateContactDto } from './createContact.dto'
import { CreateHelpdeskDto } from './createHelpdesk.dto'

export class CreateOrganisationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string

  @IsOptional()
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
  @IsString()
  @ApiPropertyOptional()
  zendeskId?: string

  @IsOptional()
  @ApiPropertyOptional()
  administrativeContact?: CreateContactDto

  @IsOptional()
  @ApiPropertyOptional()
  technicalContact?: CreateContactDto

  @IsOptional()
  @ApiPropertyOptional()
  helpdesk?: CreateHelpdeskDto
}
