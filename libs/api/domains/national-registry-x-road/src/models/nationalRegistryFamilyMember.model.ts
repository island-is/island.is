import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryAddress } from './nationalRegistryAddress.model'

@ObjectType()
export class NationalRegistryFamilyMemberInfo {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String)
  genderCode!: string

  @Field(() => NationalRegistryAddress, { nullable: true })
  address?: NationalRegistryAddress | null
}
