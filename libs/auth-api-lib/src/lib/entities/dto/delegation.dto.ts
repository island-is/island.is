import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator'
import { DelegationScopeDTO } from './delegation-scope.dto'

export class DelegationDTO {
  @IsString()
  @ApiProperty()
  fromDisplayName!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @IsOptional()
  @ApiProperty()
  @IsArray()
  scopes?: DelegationScopeDTO[]
}
