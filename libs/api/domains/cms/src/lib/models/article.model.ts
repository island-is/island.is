import { Field, ObjectType } from '@nestjs/graphql'
import { Taxonomy } from './taxonomy.model'

@ObjectType()
export class Article {
  @Field()
  id: string

  @Field()
  slug: string

  @Field()
  title: string

  @Field({ nullable: true })
  content?: string

  @Field(() => Taxonomy, { nullable: true })
  group?: Taxonomy

  @Field(() => Taxonomy, { nullable: true })
  category?: Taxonomy

  @Field(() => [Article])
  relatedArticles: Article[]
}
