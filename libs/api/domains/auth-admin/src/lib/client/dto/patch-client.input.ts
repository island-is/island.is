import { Field, InputType, Int } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'
import { ClientClaim } from '../models/client-claim.model'
import { RefreshTokenExpiration } from '../../models/refreshTokenExpiration.enum'
import { ClientSso } from '../../models/client-sso.enum'

@InputType('AuthAdminPatchClientInput')
export class PatchClientInput {
  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => [TranslatedValue], { nullable: true })
  displayName?: TranslatedValue[]

  @Field(() => [String], { nullable: true })
  redirectUris?: string[]

  @Field(() => [String], { nullable: true })
  postLogoutRedirectUris?: string[]

  @Field(() => Int, { nullable: true })
  absoluteRefreshTokenLifetime?: number

  @Field(() => Int, { nullable: true })
  slidingRefreshTokenLifetime?: number

  @Field(() => RefreshTokenExpiration, { nullable: true })
  refreshTokenExpiration?: RefreshTokenExpiration

  @Field(() => [String], { nullable: true })
  addedDelegationTypes?: string[]

  @Field(() => [String], { nullable: true })
  removedDelegationTypes?: string[]

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  supportsCustomDelegation?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  supportsLegalGuardians?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  supportsProcuringHolders?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  supportsPersonalRepresentatives?: boolean

  @Field(() => Boolean, { nullable: true })
  promptDelegations?: boolean

  @Field(() => Boolean, { nullable: true })
  requireApiScopes?: boolean

  @Field(() => Boolean, { nullable: true })
  requireConsent?: boolean

  @Field(() => Boolean, { nullable: true })
  allowOfflineAccess?: boolean

  @Field(() => Boolean, { nullable: true })
  requirePkce?: boolean

  @Field(() => Boolean, { nullable: true })
  singleSession?: boolean

  @Field(() => Boolean, { nullable: true })
  supportTokenExchange?: boolean

  @Field(() => Int, { nullable: true })
  accessTokenLifetime?: number

  @Field(() => [ClientClaim], { nullable: true })
  customClaims?: ClientClaim[]

  @Field(() => [String], { nullable: true })
  addedScopes?: string[]

  @Field(() => [String], { nullable: true })
  removedScopes?: string[]

  @Field(() => ClientSso, { nullable: true })
  sso?: ClientSso
}
