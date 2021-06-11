import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsDateString } from 'class-validator'

import { ApiScopesDTO } from './api-scopes.dto'
import { IdentityResourcesDTO } from './Identity-resources.dto'

export class UpdateDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  validTo?: Date
}

export class DelegationScopeDTO {
  @ApiPropertyOptional()
  id?: string

  @IsString()
  @ApiProperty()
  delegationId!: string

  @IsString()
  @ApiProperty()
  scopeName?: string

  @IsOptional()
  @ApiPropertyOptional({ type: ApiScopesDTO })
  apiScope?: ApiScopesDTO

  @IsString()
  @ApiProperty()
  identityResourceName?: string

  @IsOptional()
  @ApiPropertyOptional({ type: IdentityResourcesDTO })
  identityResource?: IdentityResourcesDTO

  @IsDateString()
  @ApiProperty()
  validFrom!: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  validTo?: Date
}
