import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { MunicipalityAidModel } from './municipalityAid.model'

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

  @Field()
  readonly homePage?: string

  @Field()
  readonly aid!: MunicipalityAidModel
}
