import {
  Field,
  ID,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

import { Identity } from '@island.is/api/domains/identity'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/clients/auth/delegation-api'

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
      case AuthDelegationType.LegalGuardianMinor:
        return LegalGuardianMinorDelegation
      case AuthDelegationType.ProcurationHolder:
        return ProcuringHolderDelegation
      case AuthDelegationType.PersonalRepresentative:
        return PersonalRepresentativeDelegation
      case AuthDelegationType.Custom:
        return CustomDelegation
      case AuthDelegationType.GeneralMandate:
        return GeneralMandate
      case AuthDelegationType.LegalRepresentative:
        return LegalRepresentativeDelegation
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

  @Field(() => Identity, { nullable: true })
  createdBy?: Identity

  @Field(() => AuthDelegationType)
  type!: AuthDelegationType

  @Field(() => AuthDelegationProvider)
  provider!: AuthDelegationProvider

  @Field(() => String, { nullable: true })
  referenceId?: string
}

@ObjectType('AuthLegalGuardianDelegation', {
  implements: Delegation,
})
export class LegalGuardianDelegation extends Delegation {}

@ObjectType('AuthLegalGuardianMinorDelegation', {
  implements: Delegation,
})
export class LegalGuardianMinorDelegation extends Delegation {}

@ObjectType('AuthProcuringHolderDelegation', {
  implements: Delegation,
})
export class ProcuringHolderDelegation extends Delegation {}

@ObjectType('AuthPersonalRepresentativeDelegation', {
  implements: Delegation,
})
export class PersonalRepresentativeDelegation extends Delegation {}

@ObjectType('AuthGeneralMandate', {
  implements: Delegation,
})
export class GeneralMandate extends Delegation {
  @Field(() => Date, { nullable: true })
  validTo?: Date
}

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

@ObjectType('AuthLegalRepresentativeDelegation', {
  implements: Delegation,
})
export class LegalRepresentativeDelegation extends Delegation {}

@ObjectType('AuthMergedDelegation')
export class MergedDelegation {
  @Field(() => [AuthDelegationType])
  types!: AuthDelegationType[]
}
