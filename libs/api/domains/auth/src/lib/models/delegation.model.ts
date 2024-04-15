import {
  Field,
  ID,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/clients/auth/delegation-api'
import { Identity } from '@island.is/api/domains/identity'

import { DelegationScope } from './delegationScope.model'

registerEnumType(AuthDelegationProvider, { name: 'AuthDelegationProvider' })
registerEnumType(AuthDelegationType, { name: 'AuthDelegationType' })

const exhaustiveCheck = (param: never) => {
  throw new Error(`Missing interfaceType ${param}`)
}

@InterfaceType('AuthDelegation', {
  resolveType(delegation: Delegation) {
    switch (delegation.type) {
      case AuthDelegationType.LegalGuardian:
        return LegalGuardianDelegation
      case AuthDelegationType.ProcurationHolder:
        return ProcuringHolderDelegation
      case AuthDelegationType.PersonalRepresentative:
        return PersonalRepresentativeDelegation
      case AuthDelegationType.Custom:
        return CustomDelegation
      default:
        exhaustiveCheck(delegation.type)
    }
  },
})
export abstract class Delegation {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field(() => Identity)
  from!: Identity

  @Field(() => Identity)
  to!: Identity

  @Field(() => AuthDelegationType)
  type!: AuthDelegationType

  @Field(() => AuthDelegationProvider)
  provider!: AuthDelegationProvider
}

@ObjectType('AuthLegalGuardianDelegation', {
  implements: Delegation,
})
export class LegalGuardianDelegation extends Delegation {}

@ObjectType('AuthProcuringHolderDelegation', {
  implements: Delegation,
})
export class ProcuringHolderDelegation extends Delegation {}

@ObjectType('AuthPersonalRepresentativeDelegation', {
  implements: Delegation,
})
export class PersonalRepresentativeDelegation extends Delegation {}

@ObjectType('AuthCustomDelegation', {
  implements: Delegation,
})
export class CustomDelegation extends Delegation {
  @Field(() => Date, { nullable: true })
  validTo?: Date

  @Field(() => [DelegationScope])
  scopes!: DelegationScope[]

  // Internal attributes, used in field resolvers.
  domainName?: string
}

@ObjectType('AuthMergedDelegation')
export class MergedDelegation {
  @Field(() => [AuthDelegationType])
  types!: AuthDelegationType[]
}
