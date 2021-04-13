import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ProviderStatistics {
  constructor(published: number, notifications: number, opened: number) {
    this.published = published
    this.notifications = notifications
    this.opened = opened
  }

  @Field(() => Number)
  published: number

  @Field(() => Number)
  notifications: number

  @Field(() => Number)
  opened: number
}
