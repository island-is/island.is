import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class ActionMailBody {
  @Field(() => Boolean)
  success?: boolean

  @Field(() => String)
  messageId?: string

  @Field(() => String)
  action?: string
}
