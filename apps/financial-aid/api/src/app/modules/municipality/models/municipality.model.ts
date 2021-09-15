import { Field, ObjectType, ID } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import type { MunicipalitySettings } from '@island.is/financial-aid/shared/lib'

import { Municipality } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class MunicipalityModel implements Municipality {
  @Field(() => ID)
  readonly id!: string

  // @Field()
  // readonly created!: string

  // @Field()
  // readonly modified!: string

  @Field()
  readonly name!: string

  @Field(() => graphqlTypeJson)
  readonly settings!: MunicipalitySettings
}
