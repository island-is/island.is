import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  nationalId?: string

  @Field(() => String, { nullable: true })
  mobilePhoneNumber?: string | null

  @Field(() => String, { nullable: true })
  locale?: string

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => Boolean)
  emailVerified!: boolean

  @Field(() => Boolean)
  mobilePhoneNumberVerified!: boolean

  @Field(() => Boolean)
  documentNotifications!: boolean

  @Field(() => Boolean, { nullable: true })
  needsNudge?: boolean | null

  @Field(() => String, { nullable: true })
  emailStatus?: string

  @Field(() => String, { nullable: true })
  mobileStatus?: string

  @Field(() => Date, {
    nullable: true,
    deprecationReason:
      'needsNudge should be used to determine if profile needs nudge. v2 doesnt provide the modified value.',
  })
  modified?: Date

  @Field(() => Boolean, { nullable: true })
  emailNotifications?: boolean

  // Temporary merge with islyklar service
  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Deprecated due to new field EmailNotification from UserProfile V2',
  })
  canNudge?: boolean

  @Field(() => String, { nullable: true })
  bankInfo?: string

  @Field(() => Boolean, { nullable: true })
  bankInfoError?: boolean
}
