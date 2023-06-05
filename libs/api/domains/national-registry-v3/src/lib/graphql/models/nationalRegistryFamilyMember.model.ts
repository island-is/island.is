import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Address } from './nationalRegistryAddress.model'

@ObjectType('NationalRegistryV3FamilyMemberInfo')
export class FamiliyMemberInfo {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String)
  genderCode!: string

  @Field(() => Address, { nullable: true })
  address?: Address | null
}
