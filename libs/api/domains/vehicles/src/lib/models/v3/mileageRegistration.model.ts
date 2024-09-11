import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('VehiclesMileageRegistration')
export class MileageRegistration {
  @Field()
  originCode!: string

  @Field(() => Int)
  mileage!: number

  @Field(() => GraphQLISODateTime)
  date!: Date
}
