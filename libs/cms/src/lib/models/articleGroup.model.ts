import { Field, ObjectType } from '@nestjs/graphql'
import { IArticleGroup } from '../generated/contentfulTypes'

@ObjectType()
export class ArticleGroup {
  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  importance?: number
}

export const mapArticleGroup = ({ fields }: IArticleGroup): ArticleGroup => ({
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  description: fields.description ?? '',
  importance: fields.importance ?? 0,
})
