import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'

import { FamilyRelation } from '../types/familyRelation.enum'
import { Gender } from '../types/gender.enum'
import { MaritalStatus } from '../types/maritalStatus.enum'

@ObjectType()
export class NationalRegistryFamilyMember {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @IsEnum(Gender)
  @Field(() => Gender, { nullable: true })
  gender?: Gender

  @IsEnum(MaritalStatus)
  @Field(() => MaritalStatus, { nullable: true })
  maritalStatus?: MaritalStatus

  @Field(() => String)
  address!: string

  @Field(() => String)
  familyRelation!: FamilyRelation
}
