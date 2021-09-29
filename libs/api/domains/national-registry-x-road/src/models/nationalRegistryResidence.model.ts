import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryResidence {
  @Field(() => NationalRegistryAddress)
  address!: NationalRegistryAddress

  @Field()
  country!: string

  @Field(() => Date, { nullable: true })
  dateOfChange!: Date
}
