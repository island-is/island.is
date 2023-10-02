import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesPublicVehicleSearch {
  @Field(() => String, { nullable: true })
  permno?: string | null

  @Field(() => String, { nullable: true })
  regno?: string | null

  @Field(() => String, { nullable: true })
  vin?: string | null

  @Field(() => String, { nullable: true })
  make?: string | null

  @Field(() => String, { nullable: true })
  vehicleCommercialName?: string | null

  @Field(() => String, { nullable: true })
  color?: string | null

  @Field(() => Date, { nullable: true })
  newRegDate?: Date | null

  @Field(() => String, { nullable: true })
  vehicleStatus?: string | null

  @Field(() => Date, { nullable: true })
  nextVehicleMainInspection?: Date | null

  @Field(() => Number, { nullable: true })
  co2?: number | null

  @Field(() => Number, { nullable: true })
  weightedCo2?: number | null

  @Field(() => Number, { nullable: true })
  co2WLTP?: number | null

  @Field(() => Number, { nullable: true })
  weightedCo2WLTP?: number | null

  @Field(() => Number, { nullable: true })
  massLaden?: number | null

  @Field(() => Number, { nullable: true })
  mass?: number | null

  @Field(() => Number, { nullable: true })
  co?: number | null

  @Field(() => String, { nullable: true })
  typeNumber?: string | null
}
