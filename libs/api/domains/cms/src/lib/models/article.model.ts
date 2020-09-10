import { Field, ObjectType } from '@nestjs/graphql'

import { IArticle } from '../generated/contentfulTypes'

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

export const mapArticle = ({ sys, fields }: IArticle): Article => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  group: fields.group?.fields,
  category: fields.category?.fields,
  content: fields.content && JSON.stringify(fields.content),
  relatedArticles: [], // populated by resolver
})
