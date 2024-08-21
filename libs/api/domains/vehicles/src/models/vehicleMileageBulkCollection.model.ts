import { Field, Int, ObjectType } from '@nestjs/graphql'
import { VehicleMileageBulkEntry } from './vehicleMileageBulkEntry.model'

@ObjectType('VehicleMileageBulkCollection')
export class VehicleMileageBulkCollection {
  @Field(() => [VehicleMileageBulkEntry])
  vehicles!: Array<VehicleMileageBulkEntry>

  @Field(() => Int, { nullable: true })
  pageNumber?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number

  @Field(() => Int, { nullable: true })
  totalPages?: number

  @Field(() => Int, { nullable: true })
  totalRecords?: number
}
