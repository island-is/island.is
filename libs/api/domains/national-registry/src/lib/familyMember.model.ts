import { Field, ObjectType } from '@nestjs/graphql'
import { FamilyRelation } from './types/familyRelation.enum'

@ObjectType()
export class FamilyMember {
  @Field(() => String)
  fullName!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  gender!: string

  @Field(() => String)
  maritalStatus!: string

  @Field(() => String)
  address!: string

  @Field(() => String)
  familyRelation!: FamilyRelation
}
