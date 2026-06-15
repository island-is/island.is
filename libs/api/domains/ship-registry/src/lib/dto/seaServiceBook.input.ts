import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('ShipRegistrySeaServiceBookInput')
export class SeaServiceBookInput {
  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field(() => Int, { nullable: true })
  rankId?: number

  @Field(() => Int)
  pageNumber!: number

  @Field(() => Int)
  pageSize!: number
}
