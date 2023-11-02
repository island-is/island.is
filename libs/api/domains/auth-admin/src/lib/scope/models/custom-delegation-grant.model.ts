import {
  createUnionType,
  CustomScalar,
  Field,
  ObjectType,
  Scalar,
} from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@ObjectType('AuthAdminScopeEnvironmentCustomDelegationGrant')
export class CustomDelegationGrant {
  @Field(() => Boolean)
  onlyForCompanies!: boolean

  @Field(() => Boolean)
  onlyForProcurationHolder!: boolean
}

export type CustomDelegationGrantType = false | CustomDelegationGrant

export const GraphQLCustomDelegationGrantType = createUnionType({
  name: 'GraphQLCustomDelegationGrantType',
  types: () => [FalseScalar, CustomDelegationGrant],
  resolveType(value) {
    if (value === false) {
      return FalseScalar
    }
    return CustomDelegationGrant
  },
})

@Scalar('False')
export class FalseScalar implements CustomScalar<false, false> {
  description = 'false as custom scalar type'

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parseValue(value: false): false {
    return value // value from the client
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  serialize(value: false): false {
    return value // value sent to the client
  }

  parseLiteral(ast: ValueNode): false {
    if (ast.kind === Kind.BOOLEAN && ast.value === false) {
      return ast.value
    }
    throw new Error('Invalid value')
  }
}
