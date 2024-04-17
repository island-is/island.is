import { Field, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType()
export class ActorProfile {
  @Field(() => String)
  fromNationalId!: string

  @Field(() => String, { nullable: true })
  fromName?: string

  @Field(() => Boolean)
  emailNotifications!: boolean
}

@ObjectType()
export class ActorProfileResponse extends PaginatedResponse(ActorProfile) {}
