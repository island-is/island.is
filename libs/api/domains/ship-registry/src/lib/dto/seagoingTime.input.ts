import { Field, Float, InputType, Int } from '@nestjs/graphql'

@InputType('ShipRegistrySeagoingTimeInput')
export class SeagoingTimeInput {
  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field(() => Int, { nullable: true })
  rankId?: number

  @Field(() => Float, { nullable: true })
  fromOrEqLength?: number

  @Field(() => Float, { nullable: true })
  fromOrEqMainEnginePower?: number

  @Field(() => Float, { nullable: true })
  fromOrEqBruttoWeight?: number

  @Field(() => Int)
  pageNumber!: number

  @Field(() => Int)
  pageSize!: number
}
