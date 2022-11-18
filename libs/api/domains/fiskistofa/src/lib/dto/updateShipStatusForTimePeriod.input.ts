import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FiskistofaCategoryChange {
  @Field()
  id!: number

  @Field()
  catchChange!: number

  @Field()
  catchQuotaChange!: number
}

@InputType()
export class FiskistofaUpdateShipStatusForTimePeriodInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string

  @Field(() => [FiskistofaCategoryChange])
  changes!: FiskistofaCategoryChange[]
}
