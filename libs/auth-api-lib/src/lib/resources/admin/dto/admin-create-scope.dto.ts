import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { AuthDelegationType } from '@island.is/shared/types'

import { AdminPatchScopeDto } from './admin-patch-scope.dto'

export class AdminCreateScopeDto extends OmitType(AdminPatchScopeDto, [
  'removedDelegationTypes',
  'addedDelegationTypes',
  'removedCategoryIds',
  'addedCategoryIds',
  'removedTagIds',
  'addedTagIds',
]) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '@island.is' })
  name!: string

  @IsArray()
  @IsOptional()
  @IsEnum(AuthDelegationType, { each: true })
  @ApiPropertyOptional({
    type: [String],
    example: ['Custom'],
  })
  supportedDelegationTypes?: AuthDelegationType[]

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    example: ['4vQ4htPOAZvzcXBcjx06SH'],
    description: 'CMS category IDs (e.g., Contentful sys.id)',
  })
  categoryIds?: string[]

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    example: ['2eGxK9pLm3'],
    description: 'CMS tag IDs (e.g., Contentful sys.id for life events)',
  })
  tagIds?: string[]
}
