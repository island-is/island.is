import { Field, Int, ObjectType } from '@nestjs/graphql'
import { VehicleCurrentWithMileage } from './currentVehicleWithMileage.model'

@ObjectType()
export class VehiclePagedList {
  @Field(() => Int)
  pageNumber!: number

  @Field(() => Int)
  pageSize!: number

  @Field(() => Int)
  totalPages!: number

  @Field(() => Int)
  totalRecords!: number

  @Field(() => [VehicleCurrentWithMileage], { nullable: true })
  vehicleList?: Array<VehicleCurrentWithMileage>
}
