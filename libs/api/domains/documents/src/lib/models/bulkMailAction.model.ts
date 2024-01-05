import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class BulkMailAction {
  @Field(() => Boolean)
  success?: boolean

  @Field(() => String)
  messageId?: string
}
