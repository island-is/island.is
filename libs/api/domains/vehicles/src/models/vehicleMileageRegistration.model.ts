import { ObjectType, Field, GraphQLISODateTime, Int } from '@nestjs/graphql'

@ObjectType('VehicleMileageRegistration')
export class VehicleMileageRegistration {
  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field()
  origin!: string

  @Field(() => Int)
  mileage!: number
}
