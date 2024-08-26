import { ModeOfDelivery, ApplicationTypes } from '@island.is/university-gateway'
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
  @ApiPropertyOptional({
    description: 'Middle name',
    example: 'Þór',
  })
  middleName?: string

  @IsString()
  @ApiProperty({
    description: 'Family name',
    example: 'Jónsson',
  })
  familyName!: string

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
}

class CreateApplicationFileDto {
  @IsString()
  @ApiProperty({
    description: 'File name',
    example: 'cv.txt',
  })
  fileName!: string

  @IsString()
  @ApiProperty({
    description: 'File type',
    example: 'profskirteini',
  })
  fileType!: string

  @IsString()
  @ApiProperty({
    description: 'A public download link to a s3 file',
    example: '',
  })
  url!: string
}

class CreateApplicationEducationDto {
  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'School name',
    example: 'Menntaskólinn í Reykjavík',
  })
  schoolName?: string

  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Degree type name',
    example: 'Stúdentspróf',
  })
  degree?: string

  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Degree name',
    example: 'Félagsfræðibraut',
  })
  degreeName?: string

  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Degree country',
    example: 'Ísland',
  })
  degreeCountry?: string

  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Finished units',
    example: '180',
  })
  finishedUnits?: string

  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Degree start date',
    example: '27.05.2022',
  })
  degreeStartDate?: string

  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'Degree end date',
    example: '27.05.2022',
  })
  degreeEndDate?: string

  @IsString()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'More details about education',
    example: 'Will be finishing in October',
  })
  moreDetails?: string

  @IsArray()
  @ApiPropertyOptional()
  @ApiProperty({
    description: 'List of education degree attachments',
    type: [CreateApplicationFileDto],
  })
  degreeAttachments?: CreateApplicationFileDto[]
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
    description: 'Application ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  applicationId!: string

  @IsUUID()
  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  programId!: string

  // @IsString()
  // @IsOptional()
  // @ApiPropertyOptional({
  //   description: 'External ID for the specialization(from University)',
  //   example: 'BLA567',
  // })
  // specializationExternalId?: string

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
  @ApiPropertyOptional({
    description:
      'Preferred languange, should be language user used when filling out application in application system',
    example: 'IS',
  })
  preferredLanguage?: string

  @IsEnum(ApplicationTypes)
  @ApiPropertyOptional({
    description: 'The chosen type of former education chosen',
    example: ApplicationTypes.DIPLOMA,
    enum: ApplicationTypes,
  })
  educationOption!: ApplicationTypes

  @IsArray()
  @ApiProperty({
    description: 'List of education',
    type: [CreateApplicationEducationDto],
  })
  educationList!: CreateApplicationEducationDto[]

  @IsArray()
  @ApiProperty({
    description: 'List of work experience',
    type: [CreateApplicationWorkExperienceDto],
  })
  workExperienceList!: CreateApplicationWorkExperienceDto[]

  @IsArray()
  @ApiProperty({
    description: 'Extra application fields',
    type: [CreateApplicationExtraFieldsDto],
  })
  extraFieldList!: CreateApplicationExtraFieldsDto[]
}
