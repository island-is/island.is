import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

import { AdminPatchScopeDto } from './admin-patch-scope.dto'

export class AdminCreateScopeDto extends AdminPatchScopeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '@island.is' })
  name!: string
}
