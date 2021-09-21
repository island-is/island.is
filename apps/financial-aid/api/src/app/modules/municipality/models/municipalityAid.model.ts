import { Field, ObjectType } from '@nestjs/graphql'

import type { MunicipalityAid } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class MunicipalityAidModal implements MunicipalityAid {
  @Field()
  readonly ownApartmentOrLease!: number

  @Field()
  readonly withOthersOrUnknow!: number

  @Field()
  readonly withParents!: number
}
