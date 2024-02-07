import { Field, ObjectType } from '@nestjs/graphql'

import { DeductionFactors } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class DeductionFactorsModel implements DeductionFactors {
  @Field()
  readonly amount!: number

  @Field()
  readonly description!: string
}
