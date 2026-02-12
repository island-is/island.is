import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { PropertyType } from '../../enums'

@ObjectType('HmsContractProperty')
export class ContractProperty {
  @Field(() => ID)
  id!: number

  @Field(() => Int)
  propertyId!: number

  @Field(() => PropertyType, { nullable: true })
  type?: PropertyType

  @Field(() => Int, { nullable: true })
  postalCode?: number

  @Field({ nullable: true })
  streetAndHouseNumber?: string

  @Field({ nullable: true })
  municipality?: string
}
