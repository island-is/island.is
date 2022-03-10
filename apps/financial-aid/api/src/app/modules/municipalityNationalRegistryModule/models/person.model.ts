import { Field, ObjectType, ID } from '@nestjs/graphql'
import { UserAddress } from './userAddress'
import { UserResidence } from './userResidence.model'
import { UserSpouse } from './userSpouse.model'

@ObjectType()
export class Person {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => String)
  genderCode!: string

  @Field(() => UserAddress, { nullable: true })
  address?: UserAddress | null

  @Field(() => Boolean, { nullable: true })
  livesWithApplicant?: boolean

  @Field(() => Boolean, { nullable: true })
  livesWithBothParents?: boolean

  @Field(() => [Person], { nullable: true })
  children?: Person[]

  @Field(() => Person, { nullable: true })
  otherParent?: Person

  @Field(() => [UserResidence], { nullable: true })
  residenceHistory?: UserResidence[]

  @Field(() => UserSpouse, { nullable: true })
  spouse?: UserSpouse
}
