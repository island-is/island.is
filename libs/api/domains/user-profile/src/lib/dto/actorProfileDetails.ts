import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserProfileActorProfileDetails')
export class ActorProfileDetails {
  @Field(() => String, { nullable: true })
  email!: string | null

  @Field(() => String)
  emailStatus!: string

  @Field(() => Boolean, { nullable: true })
  needsNudge!: boolean | null

  @Field(() => String)
  nationalId!: string

  @Field(() => Boolean)
  emailNotifications!: boolean

  @Field(() => Boolean)
  emailVerified!: boolean
}
