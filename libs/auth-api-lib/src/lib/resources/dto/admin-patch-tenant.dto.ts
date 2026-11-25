import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { IsOptional, IsString, Matches } from 'class-validator'

import { AdminCreateTenantDto } from './admin-create-tenant.dto'

const SAFE_TEXT_OR_EMPTY_REGEX = /^[^<>%$]*$/

/** All fields from AdminCreateTenantDto except `name`, all optional. */
export class AdminPatchTenantDto extends PartialType(
  OmitType(AdminCreateTenantDto, ['name'] as const),
) {
  @IsOptional()
  @IsString()
  @Matches(SAFE_TEXT_OR_EMPTY_REGEX, {
    message: 'English display name contains invalid characters',
  })
  @ApiPropertyOptional({
    example: 'My pages Ísland.is',
    description:
      'English display name. An empty string removes the translation so the Icelandic value is used.',
  })
  displayNameEn?: string

  @IsOptional()
  @IsString()
  @Matches(SAFE_TEXT_OR_EMPTY_REGEX, {
    message: 'English description contains invalid characters',
  })
  @ApiPropertyOptional({
    example: 'Domain for Island.is',
    description:
      'English description. An empty string removes the translation so the Icelandic value is used.',
  })
  descriptionEn?: string
}
