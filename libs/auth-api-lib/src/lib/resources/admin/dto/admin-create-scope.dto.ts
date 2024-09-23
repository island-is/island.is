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
}
