import { ApiProperty } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { ModeOfDelivery } from '@island.is/university-gateway-types'

import type { ProgramModeOfDelivery as TProgramModeOfDelivery } from '@island.is/university-gateway-types'

registerEnumType(ModeOfDelivery, { name: 'ModeOfDelivery' })

@ObjectType()
export class ProgramModeOfDelivery implements TProgramModeOfDelivery {
  @Field(() => ID)
  readonly id!: string

  @Field()
  programId!: string

  @Field(() => ModeOfDelivery)
  modeOfDelivery!: ModeOfDelivery

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
