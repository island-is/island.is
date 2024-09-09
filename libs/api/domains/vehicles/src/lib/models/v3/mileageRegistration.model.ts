import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VehiclesMileageRegistration')
export class MileageRegistration {
  @Field()
  originCode!: string

  @Field()
  mileage!: string
}
