import { Field, ObjectType } from '@nestjs/graphql'

import { UserProfile } from './userProfile.model'

@ObjectType('UserProfileAdminProfile')
export class AdminUserProfile extends UserProfile {
  @Field(() => Date, { nullable: true })
  lastNudge?: Date

  @Field(() => Date, { nullable: true })
  nextNudge?: Date
}
