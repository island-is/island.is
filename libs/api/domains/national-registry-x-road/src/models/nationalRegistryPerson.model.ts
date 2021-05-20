import { Field, ObjectType } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryPerson {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => NationalRegistryAddress)
  address!: NationalRegistryAddress
}
