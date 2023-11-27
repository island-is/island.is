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

  @Field(() => Boolean, { nullable: true })
  grantToLegalGuardians?: boolean

  @Field(() => Boolean, { nullable: true })
  grantToProcuringHolders?: boolean

  @Field(() => Boolean, { nullable: true })
  allowExplicitDelegationGrant?: boolean

  @Field(() => Boolean, { nullable: true })
  isAccessControlled?: boolean

  @Field(() => Boolean, { nullable: true })
  grantToPersonalRepresentatives?: boolean

  @Field(() => Boolean, { nullable: true })
  onlyForCompanies?: boolean

  @Field(() => Boolean, { nullable: true })
  onlyForProcurationHolder?: boolean
}
