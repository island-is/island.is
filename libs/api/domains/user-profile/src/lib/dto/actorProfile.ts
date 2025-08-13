import { Field, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('UserProfileActorProfile')
export class ActorProfile {
  @Field(() => String)
  fromNationalId!: string

  @Field(() => Boolean)
  emailNotifications!: boolean

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => String, { nullable: true })
  emailsId?: string | null
}

@ObjectType('UserProfileActorProfileResponse')
export class ActorProfileResponse extends PaginatedResponse(ActorProfile) {}
