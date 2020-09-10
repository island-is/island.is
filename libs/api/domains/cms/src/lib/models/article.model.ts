import { Field, ObjectType } from '@nestjs/graphql'

import { Taxonomy } from './taxonomy.model'
import { IArticle } from '../generated/contentfulTypes'

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
  subgroup?: Taxonomy

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
  subgroup: fields.subgroup?.fields,
  category: fields.category?.fields,
  content: fields.content && JSON.stringify(fields.content),
  relatedArticles: [], // populated by resolver
})
