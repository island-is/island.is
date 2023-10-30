import { ModeOfDelivery } from '@island.is/university-gateway'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

class CreateApplicationApplicantDto {
  @IsString()
  @ApiProperty({
    description: 'Given name',
    example: 'Jón',
  })
  givenName!: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Middle name',
    example: 'Þór',
  })
  @ApiPropertyOptional()
  middleName?: string

  @IsString()
  @ApiProperty({
    description: 'Family name',
    example: 'Jónsson',
  })
  familyName!: string

  @IsString()
  @ApiProperty({
    description: 'Email',
    example: 'jon.jonsson@island.is',
  })
  email!: string

  @IsString()
  @ApiProperty({
    description: 'Phone number',
    example: '+3548123456',
  })
  phone!: string

  @IsString()
  @ApiProperty({
    description: 'Gender code',
    example: '1',
  })
  genderCode!: string

  @IsString()
  @ApiProperty({
    description: 'Citizenship',
    example: 'IS',
  })
  citizenshipCode!: string

  @IsString()
  @ApiProperty({
    description: 'Street address for legal domicile',
    example: 'Borgartún 37',
  })
  streetAddress!: string

  @IsString()
  @ApiProperty({
    description: 'Postal code for legal domicile',
    example: '105',
  })
  postalCode!: string

  @IsString()
  @ApiProperty({
    description: 'City for legal domicile',
    example: 'Reykjavík',
  })
  city!: string

  @IsString()
  @ApiProperty({
    description: 'Municipality code for legal domicile',
    example: 'Höfuðborgarsvæðið',
  })
  municipalityCode!: string

  @IsString()
  @ApiProperty({
    description: 'Country code for legal domicile',
    example: 'IS',
  })
  countryCode!: string
}

class CreateApplicationEducationDto {
  @IsString()
  @ApiProperty({
    description: 'School name',
    example: 'Menntaskólinn í Reykjavík',
  })
  school!: string

  @IsString()
  @ApiProperty({
    description: 'Degree type name',
    example: 'Stúdentspróf',
  })
  degree!: string
}

class CreateApplicationWorkExperienceDto {
  @IsString()
  @ApiProperty({
    description: 'Company name',
    example: 'Origo',
  })
  company!: string

  @IsString()
  @ApiProperty({
    description: 'Job title',
    example: 'Programmer',
  })
  jobTitle!: string
}

class CreateApplicationExtraFieldsDto {
  @IsString()
  @ApiProperty({
    description: 'Field key',
    example: 'cv_field',
  })
  key!: string

  @IsObject()
  @ApiProperty({
    description: 'Field value',
    example: 'some_base_64_string',
  })
  value!: object
}

export class CreateApplicationDto {
  @IsUUID()
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  universityId!: string

  @IsUUID()
  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  programId!: string

  @IsEnum(ModeOfDelivery)
  @ApiProperty({
    description: 'What mode of delivery was selected in the application',
    example: ModeOfDelivery.ON_SITE,
    enum: ModeOfDelivery,
  })
  modeOfDelivery!: ModeOfDelivery

  @IsObject()
  @ApiProperty({
    description: 'Information about applicant',
  })
  applicant!: CreateApplicationApplicantDto

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'Preferred languange, should be language user used when filling out application in application system',
    example: 'IS',
  })
  @ApiPropertyOptional()
  preferredLanguage?: string

  @IsArray()
  @ApiProperty({
    description: 'List of education',
  })
  educationList!: CreateApplicationEducationDto[]

  @IsArray()
  @ApiProperty({
    description: 'List of work experience',
  })
  workExperienceList!: CreateApplicationWorkExperienceDto[]

  @IsArray()
  @ApiProperty({
    description: 'Extra application fields',
  })
  extraFieldList!: CreateApplicationExtraFieldsDto[]
}
