import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { ILink, ISupportQna } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Link, mapLink } from './link.model'

import { mapOrganization, Organization } from './organization.model'
import { mapSupportCategory, SupportCategory } from './supportCategory.model'
import {
  mapSupportSubCategory,
  SupportSubCategory,
} from './supportSubCategory.model'

@ObjectType()
export class SupportQNA {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [SliceUnion])
  answer: Array<typeof SliceUnion> = []

  @Field()
  slug!: string

  @CacheField(() => Organization, { nullable: true })
  organization!: Organization | null

  @CacheField(() => SupportCategory, { nullable: true })
  category!: SupportCategory | null

  @CacheField(() => SupportSubCategory, { nullable: true })
  subCategory!: SupportSubCategory | null

  @Field()
  importance!: number

  @CacheField(() => [Link])
  relatedLinks?: Link[]

  @Field()
  contactLink?: string
}

export const mapSupportQNA = ({ fields, sys }: ISupportQna): SupportQNA => ({
  id: sys.id,
  title: fields.question,
  answer: fields.answer ? mapDocument(fields.answer, sys.id) : [],
  slug: fields.slug,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  category: fields.category ? mapSupportCategory(fields.category) : null,
  subCategory: fields.subCategory
    ? mapSupportSubCategory(fields.subCategory)
    : null,
  importance: fields.importance ?? 0,
  relatedLinks: fields.relatedLinks
    ? fields.relatedLinks.map((link) => {
        if (link.sys?.contentType?.sys?.id === 'link') {
          return mapLink(link as ILink)
        }
        const supportQnA = link as ISupportQna
        return mapLink(convertSupportQnAToLink(supportQnA, sys.locale))
      })
    : [],
  contactLink: fields.contactLink ?? '',
})

const convertSupportQnAToLink = (supportQnA: ISupportQna, locale = 'is-IS') => {
  return {
    sys: {
      ...supportQnA.sys,
      contentType: {
        sys: {
          id: 'link',
          linkType: 'ContentType',
          type: 'Link',
        },
      },
    },
    fields: {
      text: supportQnA.fields.question,
      url: `/${locale === 'is-IS' ? 'adstod' : `${locale}/help`}/${
        supportQnA.fields.organization?.fields?.slug ?? ''
      }/${supportQnA.fields.category?.fields?.slug ?? ''}/${
        supportQnA.fields?.slug ?? ''
      }`,
    },
  } as ILink
}
