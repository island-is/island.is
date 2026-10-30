import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ServiceInterruptionBanner {
  @Field(() => String)
  readonly title!: string

  @Field(() => String)
  readonly globalMessage!: string

  @Field(() => String)
  readonly prosecutorMessage!: string

  @Field(() => String)
  readonly courtMessage!: string
}
