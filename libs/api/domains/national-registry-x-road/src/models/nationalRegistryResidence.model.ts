import { Field, ObjectType } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryResidence {
  @Field(() => NationalRegistryAddress)
  address!: NationalRegistryAddress

  @Field(() => String, { nullable: true })
  houseIdentificationCode?: string | null

  @Field(() => String, { nullable: true })
  realEstateNumber?: string | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field(() => Date, { nullable: true })
  dateOfChange?: Date | null
}
