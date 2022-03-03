import { Field, ID,ObjectType } from '@nestjs/graphql'

import { FamilyRelation,Gender } from '../../types'

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
