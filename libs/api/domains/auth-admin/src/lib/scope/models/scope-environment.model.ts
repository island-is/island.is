import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { TranslatedValue } from '../../models/translated-value.model'

@ObjectType('AuthAdminScopeEnvironment')
export class ScopeEnvironment {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => ID)
  name!: string

  @Field(() => [TranslatedValue], { nullable: false })
  displayName!: TranslatedValue[]

  @Field(() => [TranslatedValue], { nullable: false })
  description!: TranslatedValue[]

  @Field(() => String)
  domainName!: string

  @Field(() => Number, { nullable: true })
  order?: number

  @Field(() => String, { nullable: true })
  groupId?: string

  @Field(() => Boolean)
  showInDiscoveryDocument!: boolean

  @Field(() => Boolean)
  required!: boolean

  @Field(() => Boolean)
  emphasize!: boolean

  @Field(() => Boolean)
  grantToAuthenticatedUser!: boolean

  @Field(() => Boolean)
  grantToLegalGuardians!: boolean

  @Field(() => Boolean)
  grantToProcuringHolders!: boolean

  @Field(() => Boolean)
  grantToPersonalRepresentatives!: boolean

  @Field(() => Boolean)
  allowExplicitDelegationGrant!: boolean

  @Field(() => Boolean)
  automaticDelegationGrant!: boolean

  @Field(() => Boolean)
  alsoForDelegatedUser!: boolean

  @Field(() => Boolean)
  isAccessControlled!: boolean

  @Field(() => Boolean)
  onlyForCompanies?: boolean

  @Field(() => Boolean)
  onlyForProcurationHolder?: boolean
}
