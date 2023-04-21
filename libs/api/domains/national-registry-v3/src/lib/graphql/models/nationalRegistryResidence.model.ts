import { Field, ObjectType } from '@nestjs/graphql'
import { NationalRegistryV3Address } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryV3Residence {
  @Field(() => NationalRegistryV3Address)
  address!: NationalRegistryV3Address

  @Field(() => String, { nullable: true })
  houseIdentificationCode?: string | null

  @Field(() => String, { nullable: true })
  realEstateNumber?: string | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field(() => Date, { nullable: true })
  dateOfChange?: Date | null
}
