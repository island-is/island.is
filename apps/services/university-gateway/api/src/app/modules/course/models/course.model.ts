import { ApiProperty } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { Season } from '@island.is/university-gateway-types'

import type { Course as TCourse } from '@island.is/university-gateway-types'

registerEnumType(Season, { name: 'Season' })

@ObjectType()
export class Course implements TCourse {
  @Field(() => ID)
  readonly id!: string

  @Field()
  externalId!: string

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string

  @Field()
  universityId!: string

  @Field()
  credits!: number

  @Field()
  semesterYear!: number

  @Field(() => Season)
  semesterSeason!: Season

  @Field()
  descriptionIs!: string

  @Field()
  descriptionEn!: string

  @Field()
  externalUrlIs!: string

  @Field()
  externalUrlEn!: string

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
