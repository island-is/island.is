import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

registerEnumType(IndictmentCountOffense, { name: 'IndictmentCountOffense' })

@ObjectType()
export class IndictmentCount {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly caseId!: string

  @Field({ nullable: true })
  readonly policeCaseNumber?: string

  @Field({ nullable: true })
  readonly vehicleRegistrationNumber?: string

  @Field(() => [IndictmentCountOffense], { nullable: true })
  readonly offenses?: IndictmentCountOffense[]

  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap

  @Field(() => [[Number, Number]], { nullable: true })
  readonly lawsBroken?: [number, number][]

  @Field({ nullable: true })
  readonly incidentDescription?: string

  @Field({ nullable: true })
  readonly legalArguments?: string
}
