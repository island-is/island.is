import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class DocumentMailAction {
  @Field(() => Boolean)
  success?: boolean

  @Field(() => [String])
  messageIds?: Array<string>
}
