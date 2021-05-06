import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
// For use with deleting Delegation-Scope
export class DelegationScopeDeleteDTO {
  @IsString()
  @ApiProperty()
  delegationId!: string
  @IsOptional()
  @IsString()
  @ApiProperty()
  scopeName?: string
}
