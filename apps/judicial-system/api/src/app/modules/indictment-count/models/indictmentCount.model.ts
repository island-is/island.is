import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import {
  IndictmentCountOffense,
  IndictmentSubtype,
} from '@island.is/judicial-system/types'

import { Offense } from './offense.model'

registerEnumType(IndictmentCountOffense, { name: 'IndictmentCountOffense' })
registerEnumType(IndictmentSubtype, { name: 'IndictmentSubtype' })

@ObjectType()
export class IndictmentCount {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string

  @Field(() => String, { nullable: true })
  readonly vehicleRegistrationNumber?: string

  @Field(() => [Offense], { nullable: true })
  readonly offenses?: Offense[]

  @Field(() => [IndictmentCountOffense], { nullable: true })
  readonly deprecatedOffenses?: IndictmentCountOffense[]

  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap

  @Field(() => [[Number, Number]], { nullable: true })
  readonly lawsBroken?: [number, number][]

  @Field(() => String, { nullable: true })
  readonly incidentDescription?: string

  @Field(() => String, { nullable: true })
  readonly legalArguments?: string

  @Field(() => [IndictmentSubtype], { nullable: true })
  readonly indictmentCountSubtypes?: IndictmentSubtype[]

  @Field(() => Int, { nullable: true })
  readonly recordedSpeed?: number

  @Field(() => Int, { nullable: true })
  readonly speedLimit?: number
}
