import { Field, ObjectType } from '@nestjs/graphql'
import { IArticleSubgroup } from '../generated/contentfulTypes'

@ObjectType()
export class ArticleSubgroup {
  @Field()
  title!: string

  @Field({ nullable: true })
  importance?: number

  @Field()
  slug!: string
}

export const mapArticleSubgroup = ({
  fields,
}: IArticleSubgroup): ArticleSubgroup => ({
  title: fields.title ?? '',
  importance: fields.importance ?? 0,
  slug: fields.slug ?? '',
})
