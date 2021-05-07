import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
// For use with deleting Delegation-Scope
export class DelegationScopeDTO {
  @IsString()
  @ApiProperty()
  delegationId!: string

  @IsString()
  @ApiProperty()
  scopeName?: string
}
