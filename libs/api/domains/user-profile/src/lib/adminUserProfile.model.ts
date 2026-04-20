import { Field, ObjectType } from '@nestjs/graphql'

import { UserProfile } from './userProfile.model'
import { Email } from './models/email.model'

@ObjectType('UserProfileAdminProfile')
export class AdminUserProfile extends UserProfile {
  @Field(() => Date, { nullable: true })
  lastNudge?: Date

  @Field(() => Date, { nullable: true })
  nextNudge?: Date

  @Field(() => [Email], { nullable: true })
  emails?: Email[] | null
}
