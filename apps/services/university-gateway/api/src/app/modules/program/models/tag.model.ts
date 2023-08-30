import { ApiProperty } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import type {
  Tag as TTag,
} from '@island.is/university-gateway-types'

@ObjectType()
export class Tag implements TTag {
  @Field(() => ID)
  readonly id!: string

  @Field()
  code!: string

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
