import { Field, ObjectType } from '@nestjs/graphql'

import { User } from './user.model'

@ObjectType()
export class CurrentUserResponse {
  @Field(() => User, { nullable: true })
  readonly user?: User

  @Field(() => [User])
  readonly eligibleUsers!: User[]
}
