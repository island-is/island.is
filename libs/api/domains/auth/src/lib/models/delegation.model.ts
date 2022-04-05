import {
  Field,
  ID,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

import {
  DelegationProvider,
  DelegationType,
} from '@island.is/clients/auth-public-api'
import { Identity } from '@island.is/api/domains/identity'

import { DelegationScope } from './delegationScope.model'

registerEnumType(DelegationProvider, { name: 'AuthDelegationProvider' })
registerEnumType(DelegationType, { name: 'AuthDelegationType' })

const exhaustiveCheck = (param: never) => {
  throw new Error(`Missing interfaceType ${param}`)
}

@InterfaceType('AuthDelegation', {
  resolveType(delegation: Delegation) {
    switch (delegation.type) {
      case DelegationType.LegalGuardian:
        return LegalGuardianDelegation
      case DelegationType.ProcurationHolder:
        return ProcuringHolderDelegation
      case DelegationType.PersonalRepresentative:
        return PersonalRepresentativeDelegation
      case DelegationType.Custom:
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

  @Field(() => DelegationType)
  type!: DelegationType

  @Field(() => DelegationProvider)
  provider!: DelegationProvider
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
}
