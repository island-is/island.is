import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class DocumentV2MarkAllMailAsRead {
  @Field(() => Boolean)
  success?: boolean
}
