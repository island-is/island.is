import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'
import { AuthDelegationType } from '@island.is/shared/types'

export class AdminPatchScopeDto {
  @ApiPropertyOptional({
    type: [TranslatedValueDto],
    example: [
      {
        locale: 'is',
        value: 'Samnefni á umfangi',
      },
      {
        locale: 'en',
        value: 'Scope alias name',
      },
    ],
  })
  @IsOptional()
  @Type(() => TranslatedValueDto)
  @ValidateNested({ each: true })
  @IsArray()
  displayName?: TranslatedValueDto[]

  @ApiPropertyOptional({
    type: [TranslatedValueDto],
    example: [
      {
        locale: 'is',
        value: 'Lýsing á umfangi',
      },
      {
        locale: 'en',
        value: 'Scope description',
      },
    ],
  })
  @IsOptional()
  @Type(() => TranslatedValueDto)
  @ValidateNested({ each: true })
  @IsArray()
  description?: TranslatedValueDto[]

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    example: false,
  })
  grantToAuthenticatedUser?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    deprecated: true,
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  grantToLegalGuardians?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    deprecated: true,
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  grantToProcuringHolders?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    deprecated: true,
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  allowExplicitDelegationGrant?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    example: false,
  })
  isAccessControlled?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    example: false,
  })
  automaticDelegationGrant?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    deprecated: true,
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  grantToPersonalRepresentatives?: boolean

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    example: ['Custom'],
  })
  addedDelegationTypes?: AuthDelegationType[]

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    example: ['Custom'],
  })
  removedDelegationTypes?: AuthDelegationType[]

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    example: ['4vQ4htPOAZvzcXBcjx06SH'],
    description: 'CMS category IDs to add to this scope',
  })
  addedCategoryIds?: string[]

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    example: ['4vQ4htPOAZvzcXBcjx06SH'],
    description: 'CMS category IDs to remove from this scope',
  })
  removedCategoryIds?: string[]

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    example: ['2eGxK9pLm3'],
    description: 'CMS tag IDs to add to this scope',
  })
  addedTagIds?: string[]

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    example: ['2eGxK9pLm3'],
    description: 'CMS tag IDs to remove from this scope',
  })
  removedTagIds?: string[]
}

/**
 * Here we can define properties that should only be editable by a super user
 *
 * For example:
 * export const superUserScopeFields = [
 *   'isAccessControlled',
 *   'grantToAuthenticatedUser',
 * ]
 */
export const superUserScopeFields: string[] = []
