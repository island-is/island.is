import { ApiProperty } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import {
  Season,
  DegreeType,
} from '@island.is/university-gateway-types'

import type {
  University as TUniversity,
} from '@island.is/university-gateway-types'

@ObjectType()
export class University implements TUniversity {
  @Field(() => ID)
  readonly id!: string

  @Field()
  nationalId!: string

  @Field()
  contentfulKey!: string

  @Field()
  created!: Date

  @Field()
  modified!: Date
}


