import { Field, ObjectType, ID } from '@nestjs/graphql'

import { BanMarking } from './banMarking.model'
import { Citizenship } from './citizenship.model'
import { Address } from './address.model'
import { Spouse } from './spouse.model'
import { Gender, MaritalStatus } from '../types'

//DEPRECATE

@ObjectType()
export class NationalRegistryUser {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: true })
  middleName?: string

  @Field(() => Gender, { nullable: true })
  gender?: Gender

  @Field(() => String, { nullable: true })
  legalResidence?: string

  @Field(() => String, { nullable: true })
  birthPlace?: string

  @Field(() => Citizenship, { nullable: true })
  citizenship?: Citizenship

  @Field(() => String, { nullable: true })
  religion?: string

  @Field(() => String, { nullable: true })
  familyNr?: string

  @Field(() => MaritalStatus, { nullable: true })
  maritalStatus?: MaritalStatus

  @Field(() => BanMarking, { nullable: true })
  banMarking?: BanMarking

  @Field(() => Number)
  age!: number

  @Field(() => Date)
  birthday!: string

  @Field(() => Address, { nullable: true })
  address?: Address

  @Field(() => Spouse, { nullable: true })
  spouse?: Spouse
}
