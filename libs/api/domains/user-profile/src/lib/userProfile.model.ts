import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  nationalId?: string

  @Field(() => String, { nullable: true })
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  locale?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Boolean)
  emailVerified!: boolean

  @Field(() => Boolean)
  mobilePhoneNumberVerified!: boolean

  @Field(() => Boolean)
  documentNotifications!: boolean

  @Field(() => String, { nullable: true })
  emailStatus?: string

  @Field(() => String, { nullable: true })
  mobileStatus?: string

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => Boolean, { nullable: true })
  emailNotifications?: boolean

  // Temporary merge with islyklar service
  @Field(() => Boolean, {
    nullable: true,
    deprecationReason:
      'Deprecated due to new field "EmailNotification" from UserProfile V2',
  })
  canNudge?: boolean

  @Field(() => String, { nullable: true })
  bankInfo?: string
}
