import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class V2UserProfile {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  locale?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Boolean, { nullable: true })
  emailVerified?: boolean

  @Field(() => Boolean, { nullable: true })
  mobilePhoneNumberVerified?: boolean

  @Field(() => Boolean, { nullable: true })
  documentNotifications?: boolean

  @Field(() => String, { nullable: true })
  profileImageUrl?: string

  @Field(() => Boolean, { nullable: true })
  emailNotifications?: boolean

  @Field(() => Boolean, { nullable: true })
  needsNudge?: boolean
}
