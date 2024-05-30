import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

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
  @ApiPropertyOptional({
    type: [String],
    example: ['Custom'],
  })
  supportedDelegationTypes?: string[]
}
