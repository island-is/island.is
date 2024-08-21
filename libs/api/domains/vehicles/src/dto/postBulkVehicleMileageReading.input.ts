import { Field, InputType } from '@nestjs/graphql'

@InputType('VehicleMileageBulkCollectionMileageInput')
export class PostBulkVehicleMileageInput {
  @Field()
  permNo!: string

  @Field({ defaultValue: 'ISLAND.IS' })
  originCode!: string

  @Field({})
  mileage!: number
}
