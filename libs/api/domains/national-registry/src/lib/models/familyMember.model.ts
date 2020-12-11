import { Field, ObjectType, ID } from '@nestjs/graphql'

import { FamilyRelation } from '../types/familyRelation.enum'

@ObjectType()
export class NationalRegistryFamilyMember {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String)
  gender!: string

  @Field(() => String)
  maritalStatus!: string

  @Field(() => String)
  address!: string

  @Field(() => String)
  familyRelation!: FamilyRelation
}
