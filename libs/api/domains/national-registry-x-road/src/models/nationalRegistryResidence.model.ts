import { Field, ObjectType } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryResidence {
  @Field(() => NationalRegistryAddress)
  address!: NationalRegistryAddress

  @Field()
  country!: string

  @Field(() => Date)
  dateOfChange!: Date
}
