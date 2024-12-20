import { Field, Int, ObjectType } from '@nestjs/graphql'
import { VehicleCurrentWithMileage } from './currentVehicleWithMileage.model'

@ObjectType()
export class VehiclesCurrentListResponse {
  @Field(() => Int)
  pageNumber!: number

  @Field(() => Int)
  pageSize!: number

  @Field(() => Int)
  totalPages!: number

  @Field(() => Int)
  totalRecords!: number

  @Field(() => [VehicleCurrentWithMileage], { nullable: true })
  data?: Array<VehicleCurrentWithMileage>
}
