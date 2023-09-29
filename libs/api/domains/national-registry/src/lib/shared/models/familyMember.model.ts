import { Field, ObjectType } from '@nestjs/graphql'
import { Gender } from '../types'
import { PersonBase } from './personBase.model'

@ObjectType('NationalRegistryFamilyMember')
export class FamilyMember extends PersonBase {
  @Field(() => Gender, { nullable: true })
  gender?: Gender | null
}
