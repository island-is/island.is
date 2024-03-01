import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class DocumentPageResponse {
  @Field(() => Int)
  messagePage?: number
}
