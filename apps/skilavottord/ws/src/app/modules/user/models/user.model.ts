import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Car } from '../../car'

@ObjectType()
export class User {
  constructor(nationalId: string, name: string, mobile: string, cars: Car[]) {
    this.nationalId = nationalId
    this.name = name
    this.mobile = mobile
    this.cars = cars
  }

  @Field((_1) => ID)
  nationalId: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string

  @Field(() => [Car], { nullable: true })
  cars?: Car[]
}
