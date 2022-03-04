import { Field, ObjectType } from '@nestjs/graphql'
import { UserAddress } from './userAddress'

@ObjectType()
export class UserResidence {
  @Field(() => UserAddress)
  address!: UserAddress

  @Field(() => String, { nullable: true })
  houseIdentificationCode?: string | null

  @Field(() => String, { nullable: true })
  realEstateNumber?: string | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field(() => Date, { nullable: true })
  dateOfChange?: Date | null
}
