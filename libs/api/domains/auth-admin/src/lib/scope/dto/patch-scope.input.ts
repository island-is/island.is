import { Environment } from '@island.is/shared/types'
import { Field, InputType } from '@nestjs/graphql'

import { TranslatedValue } from '../../models/translated-value.model'

@InputType('AuthAdminPatchScopeInput')
export class AdminPatchScopeInput {
  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String, { nullable: false })
  scopeName!: string

  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => [TranslatedValue], { nullable: true })
  displayName?: TranslatedValue[]

  @Field(() => [TranslatedValue], { nullable: true })
  description?: TranslatedValue[]

  @Field(() => Boolean, { nullable: true })
  grantToAuthenticatedUser?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason: 'Use supportedDelegationTypes instead',
  })
  grantToLegalGuardians?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason: 'Use supportedDelegationTypes instead',
  })
  grantToProcuringHolders?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason: 'Use supportedDelegationTypes instead',
  })
  allowExplicitDelegationGrant?: boolean

  @Field(() => Boolean, { nullable: true })
  isAccessControlled?: boolean

  @Field(() => Boolean, { nullable: true })
  automaticDelegationGrant?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason: 'Use supportedDelegationTypes instead',
  })
  grantToPersonalRepresentatives?: boolean

  @Field(() => [String], {
    nullable: true,
    description:
      "Absolute set of supported delegation types for the scope. The backend computes added/removed delegation types per environment based on each environment's current state, so the same input can be safely fanned out across environments.",
  })
  supportedDelegationTypes?: string[]

  @Field(() => [String], {
    nullable: true,
    description:
      "Absolute set of category IDs for the scope. The backend computes added/removed category IDs per environment based on each environment's current state, so the same input can be safely fanned out across environments.",
  })
  categoryIds?: string[]

  @Field(() => [String], {
    nullable: true,
    description:
      "Absolute set of tag IDs for the scope. The backend computes added/removed tag IDs per environment based on each environment's current state, so the same input can be safely fanned out across environments.",
  })
  tagIds?: string[]

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Whether this scope allows write access (read access is always implicit)',
  })
  allowsWrite?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Whether this scope requires step-up authentication (tvöfalt samþykki) for sensitive information access',
  })
  requiresConfirmation?: boolean

  @Field(() => String, {
    nullable: true,
    description: 'URL to redirect to for third party delegation login',
  })
  thirdPartyLoginUrl?: string
}
