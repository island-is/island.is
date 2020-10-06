import { Field, ObjectType } from '@nestjs/graphql'
import { IFeatured } from '../generated/contentfulTypes'
import { Article, mapArticle } from './article.model'

@ObjectType()
export class Featured {
  @Field()
  title: string

  @Field(() => Boolean)
  attention: boolean

  @Field(() => Article)
  thing: Article
}

export const mapFeatured = ({ sys, fields }: IFeatured): Featured => ({
  title: fields.title ?? '',
  attention: fields.attention ?? false,
  thing: fields.thing && mapArticle(fields.thing),
})
