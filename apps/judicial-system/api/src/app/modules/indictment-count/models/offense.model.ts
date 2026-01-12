import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

registerEnumType(IndictmentCountOffense, { name: 'IndictmentCountOffense' })

@ObjectType()
export class Offense {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly indictmentCountId?: string

  @Field(() => IndictmentCountOffense, { nullable: false })
  readonly offense!: IndictmentCountOffense

  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap
}
