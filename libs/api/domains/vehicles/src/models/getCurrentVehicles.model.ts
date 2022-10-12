import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehiclesCurrentVehicle {
  @Field({ nullable: true })
  permno?: string

  @Field({ nullable: true })
  make?: string

  @Field({ nullable: true })
  color?: string

  @Field({ nullable: true })
  role?: string
}
