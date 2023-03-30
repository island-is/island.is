import { SystemMetadata } from '@island.is/shared/types'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISubArticle } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { ArticleReference, mapArticleReference } from './articleReference'

@ObjectType()
export class SubArticle {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field(() => ArticleReference, { nullable: true })
  parent?: ArticleReference

  @Field(() => [SliceUnion])
  body: Array<typeof SliceUnion> = []

  @Field({ nullable: true })
  showTableOfContents?: boolean
}

export const mapSubArticle = ({
  sys,
  fields,
}: ISubArticle): SystemMetadata<SubArticle> => {
  let slug = ''
  const parentSlug = fields.parent?.fields?.slug ?? ''

  if (parentSlug) {
    slug = `${parentSlug}/${fields.url?.split('/')?.pop() ?? ''}`
  }

  return {
    typename: 'SubArticle',
    id: sys.id,
    title: fields.title ?? '',
    slug,
    parent: fields.parent?.fields && mapArticleReference(fields.parent),
    body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
    showTableOfContents: fields.showTableOfContents ?? false,
  }
}
