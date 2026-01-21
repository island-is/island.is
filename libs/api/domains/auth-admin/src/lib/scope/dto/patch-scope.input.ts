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
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  grantToLegalGuardians?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  grantToProcuringHolders?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  allowExplicitDelegationGrant?: boolean

  @Field(() => Boolean, { nullable: true })
  isAccessControlled?: boolean

  @Field(() => Boolean, { nullable: true })
  automaticDelegationGrant?: boolean

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Use addedDelegationTypes or removedDelegationTypes instead',
  })
  grantToPersonalRepresentatives?: boolean

  @Field(() => [String], { nullable: true })
  addedDelegationTypes?: string[]

  @Field(() => [String], { nullable: true })
  removedDelegationTypes?: string[]

  @Field(() => [String], { nullable: true })
  addedCategoryIds?: string[]

  @Field(() => [String], { nullable: true })
  removedCategoryIds?: string[]

  @Field(() => [String], { nullable: true })
  addedTagIds?: string[]

  @Field(() => [String], { nullable: true })
  removedTagIds?: string[]

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
}
