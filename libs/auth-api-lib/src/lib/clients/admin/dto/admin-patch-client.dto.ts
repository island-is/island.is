import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator'

import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'
import { ClientSso, RefreshTokenExpiration } from '../../../types'
import { AdminClientClaimDto } from './admin-client-claim.dto'
import { AuthDelegationType } from '@island.is/shared/types'

export class AdminPatchClientDto {
  @ApiPropertyOptional({
    type: [TranslatedValueDto],
    example: [
      {
        locale: 'is',
        value: 'Mínar síður ísland.is',
      },
      {
        locale: 'en',
        value: 'My pages on island.is',
      },
    ],
  })
  @Type(() => TranslatedValueDto)
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  displayName?: TranslatedValueDto[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  redirectUris?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  postLogoutRedirectUris?: string[]

  @ApiPropertyOptional({
    description: 'Absolute lifetime of refresh token in seconds',
  })
  @IsOptional()
  @IsInt()
  absoluteRefreshTokenLifetime?: number

  @ApiPropertyOptional({
    description: 'Sliding lifetime of refresh token in seconds',
  })
  @IsOptional()
  @IsInt()
  slidingRefreshTokenLifetime?: number

  @ApiPropertyOptional({
    description:
      'Indicates if refresh token should expire after inactivity (Sliding) described in `slidingRefreshTokenLifetime` or fixed point in time (Absolute) described in `absoluteRefreshTokenLifetime`',
    enum: RefreshTokenExpiration,
    enumName: 'RefreshTokenExpiration',
  })
  @IsOptional()
  @IsEnum(RefreshTokenExpiration)
  refreshTokenExpiration?: RefreshTokenExpiration

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsArray()
  addedDelegationTypes?: AuthDelegationType[]

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsArray()
  removedDelegationTypes?: AuthDelegationType[]

  @ApiPropertyOptional({
    deprecated: true,
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  @IsOptional()
  @IsBoolean()
  supportsCustomDelegation?: boolean

  @ApiPropertyOptional({
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
    deprecated: true,
  })
  @IsOptional()
  @IsBoolean()
  supportsLegalGuardians?: boolean

  @ApiPropertyOptional({
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
    deprecated: true,
  })
  @IsOptional()
  @IsBoolean()
  supportsProcuringHolders?: boolean

  @ApiPropertyOptional({
    description: 'Use addedDelegationTypes or removedDelegationTypes instead',
    deprecated: true,
  })
  @IsOptional()
  @IsBoolean()
  supportsPersonalRepresentatives?: boolean

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsBoolean()
  promptDelegations?: boolean

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsBoolean()
  requireApiScopes?: boolean

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsBoolean()
  requireConsent?: boolean

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsBoolean()
  allowOfflineAccess?: boolean

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsBoolean()
  requirePkce?: boolean

  @ApiPropertyOptional({
    description:
      'Indicates if the client supports token exchange grant. Only available for machine clients and only super users can update this value',
  })
  @IsOptional()
  @IsBoolean()
  supportTokenExchange?: boolean

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsInt()
  accessTokenLifetime?: number

  @ApiPropertyOptional({
    description: 'Only super users can update this value.',
  })
  @IsOptional()
  @IsBoolean()
  singleSession?: boolean

  @ApiPropertyOptional({
    description:
      'Dictionary of custom claims added to access tokens. Only super users can update this value.',
    type: [AdminClientClaimDto],
  })
  @IsOptional()
  @Type(() => AdminClientClaimDto)
  @ValidateNested({ each: true })
  @IsArray()
  customClaims?: AdminClientClaimDto[]

  @ApiPropertyOptional({
    description: 'Scopes to grant to client.',
  })
  @IsOptional()
  @IsArray()
  addedScopes?: string[]

  @ApiPropertyOptional({
    description: 'Scopes to revoke from client.',
  })
  @IsOptional()
  @IsArray()
  removedScopes?: string[]

  @ApiPropertyOptional({
    description: 'Contact email for owner',
  })
  @IsOptional()
  contactEmail?: string

  @ApiPropertyOptional({
    description: 'Array of allowed acr values for the client.',
    example: '[eidas-loa-high]',
  })
  @IsOptional()
  allowedAcr?: string[]

  @IsOptional()
  @IsEnum(ClientSso)
  @ApiPropertyOptional({
    example: 'enabled',
    enum: ClientSso,
    enumName: 'ClientSso',
  })
  readonly sso?: ClientSso
}

export const superUserFields = [
  'requireConsent',
  'allowOfflineAccess',
  'requirePkce',
  'supportTokenExchange',
  'accessTokenLifetime',
  'customClaims',
  'singleSession',
  'allowedAcr',
]
