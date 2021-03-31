import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IArticle } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class ArticleReference {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  slug?: string

  @Field()
  intro?: string
}

export const mapArticleReference = ({
  fields,
  sys,
}: IArticle): SystemMetadata<ArticleReference> => ({
  typename: 'Article',
  id: sys.id,
  title: fields?.title ?? '',
  slug: fields?.slug ?? '',
  intro: fields?.intro ?? '',
})
