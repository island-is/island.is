import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentCustomer')
export class Customer {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string
}
