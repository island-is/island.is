import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class BookId {
  @Field({ nullable: true })
  bookId?: string

}

@ObjectType()
export class ActiveBookIdResponse {
  @Field(() => BookId, { nullable: true })
  data?: BookId
}
