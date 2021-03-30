import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IArticleCategory } from '../generated/contentfulTypes'

@ObjectType()
export class ArticleCategory {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  description?: string
}

export const mapArticleCategory = ({
  sys,
  fields,
}: IArticleCategory): ArticleCategory => ({
  id: sys.id,
  title: fields?.title ?? '',
  slug: fields?.slug ?? '',
  description: fields?.description ?? '',
})
