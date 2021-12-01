import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator'

import { ApiScopesDTO } from './api-scopes.dto'
import { IdentityResourcesDTO } from './identity-resources.dto'

export enum ScopeType {
  ApiScope = 'apiScope',
  IdentityResource = 'identityResource',
}

export class UpdateDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  name!: string

  @IsEnum(ScopeType)
  @ApiProperty({ enum: ScopeType, enumName: 'ScopeType' })
  type!: ScopeType

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description:
      'A date that the delegation is valid to. Must be in the future.',
  })
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
  scopeName!: string

  @IsString()
  @ApiProperty()
  displayName!: string

  @IsDateString()
  @ApiProperty()
  validFrom!: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  validTo?: Date
}
