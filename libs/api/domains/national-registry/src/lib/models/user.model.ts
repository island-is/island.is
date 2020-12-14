import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { Gender, MaritalStatus } from '../types'
import { BanMarking } from './banMarking.model'

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
})

registerEnumType(Gender, {
  name: 'Gender',
})

@ObjectType()
export class NationalRegistryUser {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => Gender, { nullable: true })
  gender?: Gender

  @Field(() => String, { nullable: true })
  legalResidence?: string

  @Field(() => String, { nullable: true })
  birthPlace?: string

  @Field(() => String, { nullable: true })
  citizenship?: string

  @Field(() => String, { nullable: true })
  religion?: string

  @Field(() => MaritalStatus, { nullable: true })
  maritalStatus?: MaritalStatus

  @Field(() => BanMarking, { nullable: true })
  banMarking?: BanMarking
}
