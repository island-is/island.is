import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsContractProperty')
export class ContractProperty {
  @Field(() => ID)
  id!: number

  @Field(() => Int)
  propertyId!: number

  @Field(() => Int, { nullable: true })
  postalCode?: number

  @Field({ nullable: true })
  streetAndHouseNumber?: string

  @Field({ nullable: true })
  municipality?: string
}
