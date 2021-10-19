import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PageInfoResponse {
  @Field()
  hasNextPage!: boolean

  @Field()
  hasPreviousPage!: boolean

  @Field({ nullable: true })
  startCursor!: string

  @Field({ nullable: true })
  endCursor!: string
}
