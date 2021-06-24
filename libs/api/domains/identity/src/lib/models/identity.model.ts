import {
  Field,
  ObjectType,
  InterfaceType,
  ID,
  registerEnumType,
} from '@nestjs/graphql'

import { NationalRegistryUser } from '@island.is/api/domains/national-registry'

import { IdentityType } from '../identity.type'
import { Address } from './address.model'

registerEnumType(IdentityType, { name: 'IdentityType' })

@InterfaceType({
  resolveType(identity: Identity) {
    switch (identity.type) {
      case IdentityType.Person:
        return IdentityPerson
      case IdentityType.Company:
        return IdentityCompany
      default:
        return null
    }
  },
})
export class Identity {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => Address, { nullable: true })
  address?: Address

  @Field(() => IdentityType)
  type!: IdentityType
}

@ObjectType({
  implements: Identity,
})
export class IdentityPerson extends NationalRegistryUser {}

@ObjectType({
  implements: Identity,
})
export class IdentityCompany {}
