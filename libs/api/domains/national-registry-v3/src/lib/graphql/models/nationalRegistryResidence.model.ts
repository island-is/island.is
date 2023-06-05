import { Field, ObjectType } from '@nestjs/graphql'
import { Address } from './nationalRegistryAddress.model'

@ObjectType('Residence')
export class Residence {
  @Field(() => Address)
  address!: Address

  @Field(() => String, { nullable: true })
  houseIdentificationCode?: string | null

  @Field(() => String, { nullable: true })
  realEstateNumber?: string | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field(() => Date, { nullable: true })
  dateOfChange?: Date | null
}
