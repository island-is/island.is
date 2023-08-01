import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Gender } from '../types'

@ObjectType('NationalRegistryFamilyMember')
export class FamilyMember {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => Gender, { nullable: true })
  gender?: Gender | null
}
