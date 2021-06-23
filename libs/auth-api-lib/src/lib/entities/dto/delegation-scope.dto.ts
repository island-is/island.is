import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator'

import { ApiScopesDTO } from './api-scopes.dto'
import { IdentityResourcesDTO } from './identity-resources.dto'

export enum ScopeType {
  API_SCOPE = 'apiScope',
  Identity_Resource = 'identityResource',
}

export class UpdateDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  name!: string

  @IsEnum(ScopeType)
  @ApiProperty({ enum: ScopeType, enumName: 'ScopeType' })
  type!: ScopeType

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
