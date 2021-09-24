import { Field, InputType, ObjectType } from '@nestjs/graphql'


@ObjectType()
export class PageInfoResponse {
  @Field()
  hasNextPage!: boolean;

  @Field()
  hasPreviousPage!: boolean;

  @Field()
  startCursor!: string;

  @Field()
  endCursor!: string;
  
}