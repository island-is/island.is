import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Gender, FamilyRelation } from '../../types'

@ObjectType()
export class NationalRegistryFamilyMember {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => Gender, { nullable: true })
  gender?: Gender

  @Field(() => String)
  familyRelation!: FamilyRelation
}
