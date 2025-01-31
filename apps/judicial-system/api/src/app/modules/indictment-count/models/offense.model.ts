import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

registerEnumType(IndictmentCountOffense, { name: 'IndictmentCountOffense' })

@ObjectType()
export class Offense {
  @Field(() => ID)
  readonly id!: string

  @Field(() => ID, { nullable: true })
  readonly indictmentCountId?: string

  @Field(() => IndictmentCountOffense, { nullable: true })
  readonly type?: IndictmentCountOffense

  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap
}
