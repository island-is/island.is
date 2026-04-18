import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'

import { IsNationalId } from '@island.is/nest/core'

const SAFE_TEXT_REGEX = /^[^<>%$]+$/

export class AdminCreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^@[a-z0-9_.-]+$/, {
    message:
      'Tenant name must start with @ and contain only lowercase letters, digits, dots, hyphens or underscores',
  })
  @ApiProperty({ example: '@island.is' })
  name!: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, {
    message: 'National id must be 10 digits',
  })
  @IsNationalId()
  @ApiProperty({ example: '0123456789' })
  nationalId!: string

  @IsString()
  @IsNotEmpty()
  @Matches(SAFE_TEXT_REGEX, {
    message: 'Display name contains invalid characters',
  })
  @ApiProperty({ example: 'Mínar síður Ísland.is' })
  displayName!: string

  @IsString()
  @IsNotEmpty()
  @Matches(SAFE_TEXT_REGEX, {
    message: 'Description contains invalid characters',
  })
  @ApiProperty({ example: 'Domain for Island.is' })
  description!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Stafrænt Ísland' })
  organisationLogoKey!: string

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'island@example.is' })
  contactEmail?: string
}
