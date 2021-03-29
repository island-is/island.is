import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISubArticle } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Article, mapArticle } from './article.model'
import { ArticleReference } from './articleReference'

@ObjectType()
export class SubArticle {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field()
  parentSlug!: string

  @Field(() => ArticleReference)
  parent!: ArticleReference

  @Field(() => [SliceUnion])
  body: Array<typeof SliceUnion> = []

  @Field({ nullable: true })
  showTableOfContents?: boolean
}

export const mapSubArticle = ({ sys, fields }: ISubArticle): SubArticle => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  parentSlug: fields.slug,
  parent: fields.parent && mapArticle(fields.parent),
  body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
  showTableOfContents: fields.showTableOfContents ?? false,
})
