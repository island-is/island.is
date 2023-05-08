import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { RefreshTokenExpiration } from '../../models/refreshTokenExpiration.enum'
import { ClientType } from '../../models/client-type.enum'
import { TranslatedValue } from '../../models/translated-value.model'
import { ClientClaim } from './client-claim.model'

@ObjectType('AuthAdminClientEnvironment')
export class ClientEnvironment {
  @Field(() => ID)
  id!: string

  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  clientId!: string

  @Field(() => String)
  tenantId!: string

  @Field(() => ClientType)
  clientType!: ClientType

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
