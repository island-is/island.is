import { Field, InputType } from '@nestjs/graphql'

@InputType('ShipRegistrySeaServiceBookFilterInput')
export class SeaServiceBookFilterInput {
  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string
}
