import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContentArticle {
  @Field(type => ID, { nullable: true })
  id: string

  @Field({ nullable: true })
  title: string

  @Field({ nullable: true })
  slug: string
}
