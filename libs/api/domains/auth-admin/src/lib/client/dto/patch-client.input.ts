import { Field, InputType, Int } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'
import { ClientClaim } from '../models/client-claim.model'
import { RefreshTokenExpiration } from '../../models/refreshTokenExpiration.enum'

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

  @Field(() => Boolean, { nullable: true })
  supportsCustomDelegation?: boolean

  @Field(() => Boolean, { nullable: true })
  supportsLegalGuardians?: boolean

  @Field(() => Boolean, { nullable: true })
  supportsProcuringHolders?: boolean

  @Field(() => Boolean, { nullable: true })
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
  supportTokenExchange?: boolean

  @Field(() => Int, { nullable: true })
  accessTokenLifetime?: number

  @Field(() => [ClientClaim], { nullable: true })
  customClaims?: ClientClaim[]

  @Field(() => [String], { nullable: true })
  addedScopes?: string[]

  @Field(() => [String], { nullable: true })
  removedScopes?: string[]
}
