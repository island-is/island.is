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

import { DelegationScope } from './delegationScope.model'

registerEnumType(DelegationProvider, { name: 'AuthDelegationProvider' })
registerEnumType(DelegationType, { name: 'AuthDelegationType' })

@InterfaceType('AuthDelegation', {
  resolveType(delegation: Delegation) {
    switch (delegation.type) {
      case DelegationType.LegalGuardian:
        return LegalGuardianDelegation
      case DelegationType.ProcurationHolder:
        return ProcuringHolderDelegation
      case DelegationType.Custom:
        return CustomDelegation
    }
  },
})
export abstract class Delegation {
  @Field()
  toNationalId!: string

  @Field()
  fromNationalId!: string

  @Field()
  fromName!: string

  @Field((type) => DelegationType)
  type!: DelegationType

  @Field((type) => DelegationProvider)
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

@ObjectType('AuthCustomDelegation', {
  implements: Delegation,
})
export class CustomDelegation extends Delegation {
  @Field((type) => ID)
  id!: string

  @Field((type) => Date, { nullable: true })
  validTo?: Date

  @Field((type) => [DelegationScope])
  scopes!: DelegationScope[]
}
