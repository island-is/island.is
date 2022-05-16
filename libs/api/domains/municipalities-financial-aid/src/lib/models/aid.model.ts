import { Field, ObjectType } from '@nestjs/graphql'

import { AidModelTypeEnum } from '@island.is/clients/municipalities-financial-aid'

@ObjectType('MunicipalitiesFinancialAidAidModel')
export class AidModel {
  @Field()
  readonly ownPlace!: number

  @Field()
  readonly registeredRenting!: number

  @Field()
  readonly unregisteredRenting!: number

  @Field()
  readonly livesWithParents!: number

  @Field()
  readonly unknown!: number

  @Field()
  readonly withOthers!: number

  @Field()
  readonly municipalityId!: string

  @Field(() => String)
  readonly type!: AidModelTypeEnum
}
