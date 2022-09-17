import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CategoryChange {
  @Field()
  id!: number

  @Field()
  catchChange!: number

  @Field()
  catchQuotaChange!: number
}

@InputType()
export class UpdateShipStatusForTimePeriodInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string

  @Field(() => [CategoryChange])
  changes!: CategoryChange[]
}
