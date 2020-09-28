import { Field, ObjectType, ID } from '@nestjs/graphql'
import {
  IArticle,
  IPage,
  IArticleCategory,
  INews,
  ILink,
  ILinkUrl,
  ILinkUrlFields,
  IArticleFields,
} from '../generated/contentfulTypes'

@ObjectType()
export class LinkReference {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  url?: string
}

export const mapLinkReference = (
  e: IPage | IArticle | INews | IArticleCategory | ILinkUrl,
): LinkReference => {
  const linkUrlFields = e.fields as ILinkUrlFields
  const linkPageFields = e.fields as IArticleFields

  return {
    url: linkUrlFields?.url ?? null,
    title: linkPageFields?.title ?? null,
    slug: linkPageFields?.slug ?? null,
    type: e.sys.contentType.sys.id,
  }
}

@ObjectType()
export class Link {
  @Field(() => ID)
  id: string

  @Field()
  text: string

  @Field()
  url: string

  @Field(() => LinkReference, { nullable: true })
  linkReference?: LinkReference
}

export const mapLink = ({ fields, sys }: ILink): Link => ({
  id: sys.id,
  text: fields.text,
  url: fields.url,
  linkReference: fields.linkReference
    ? mapLinkReference(fields.linkReference)
    : null,
})
