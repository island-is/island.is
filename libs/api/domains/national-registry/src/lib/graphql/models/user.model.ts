import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Gender, MaritalStatus } from '../../types'
import { BanMarking } from './banMarking.model'
import { Address } from './address.model'
import { Citizenship } from './citizenship.model'

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

  @Field(() => Citizenship, { nullable: true })
  citizenship?: Citizenship

  @Field(() => String, { nullable: true })
  religion?: string

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

  @Field(() => String, { nullable: true })
  spouseName?: string

  @Field(() => String, { nullable: true })
  spouseNationalId?: string

  @Field(() => String, { nullable: true })
  spouseCohab?: string
}
