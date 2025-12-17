import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsCustomer')
export class Customer {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string
}
