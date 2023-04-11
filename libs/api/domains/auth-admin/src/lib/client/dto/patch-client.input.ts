import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { RefreshTokenExpiration } from '@island.is/auth-api-lib'
import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'
import { ClientClaim } from '../models/client-claim.model'

registerEnumType(RefreshTokenExpiration, { name: 'RefreshTokenExpiration' })

@ObjectType('AuthAdminPatchClientInput')
export class PatchClientInput {
  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String)
  clientId!: string

  @Field(() => String)
  tenantId!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  @Field(() => [String])
  redirectUris!: string[]

  @Field(() => [String])
  postLogoutRedirectUris!: string[]

  @Field(() => Int)
  absoluteRefreshTokenLifetime!: number

  @Field(() => Int)
  slidingRefreshTokenLifetime!: number

  @Field(() => RefreshTokenExpiration)
  refreshTokenExpiration!: RefreshTokenExpiration

  @Field(() => Boolean)
  supportsCustomDelegation!: boolean

  @Field(() => Boolean)
  supportsLegalGuardians!: boolean

  @Field(() => Boolean)
  supportsProcuringHolders!: boolean

  @Field(() => Boolean)
  supportsPersonalRepresentatives!: boolean

  @Field(() => Boolean)
  promptDelegations!: boolean

  @Field(() => Boolean)
  requireApiScopes!: boolean

  @Field(() => Boolean)
  requireConsent!: boolean

  @Field(() => Boolean)
  allowOfflineAccess!: boolean

  @Field(() => Boolean)
  requirePkce!: boolean

  @Field(() => Boolean)
  supportTokenExchange!: boolean

  @Field(() => Int)
  accessTokenLifetime!: number

  @Field(() => [ClientClaim], { nullable: true })
  customClaims?: ClientClaim[]
}
