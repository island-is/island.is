import {
  Field,
  Extensions,
  MiddlewareContext,
  ObjectType,
  InterfaceType,
  ID,
  registerEnumType,
} from '@nestjs/graphql'

import { NationalRegistryUser } from '@island.is/api/domains/national-registry'
import type { GraphQLContext } from '@island.is/auth-nest-tools'

import { Address } from './address.model'
import { IdentityType } from '@island.is/clients/identity'

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

  @Field(() => String, { nullable: true })
  givenName?: string | null

  @Field(() => String, { nullable: true })
  familyName?: string | null

  @Field(() => String)
  name!: string

  @Field(() => Address, { nullable: true })
  address?: Address

  @Field(() => IdentityType)
  type!: IdentityType
}

const isExternalUser = ({ context, source }: MiddlewareContext): boolean => {
  return (context as GraphQLContext).req.user?.nationalId !== source.nationalId
}

@Extensions({
  filterFields: {
    condition: isExternalUser,
    fields: [
      'address',
      'age',
      'fullName',
      'birthday',
      'type',
      'name',
      'givenName',
      'familyName',
      'nationalId',
    ],
  },
})
@ObjectType({
  implements: Identity,
})
export class IdentityPerson extends NationalRegistryUser {}

@ObjectType({
  implements: Identity,
})
export class IdentityCompany {}
