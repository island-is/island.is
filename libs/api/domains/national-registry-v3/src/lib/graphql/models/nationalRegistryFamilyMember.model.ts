import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryV3Address } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryFamilyMemberInfo {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String)
  genderCode!: string

  @Field(() => NationalRegistryV3Address, { nullable: true })
  address?: NationalRegistryV3Address | null
}
