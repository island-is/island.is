import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Link, mapLink } from './link.model'
import { mapSupportQNA, SupportQNA } from './supportQNA.model'
import { IFeaturedSupportQnAs } from '../generated/contentfulTypes'
import { GetFeaturedSupportQNAsInput } from '../dto/getFeaturedSupportQNAs.input'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@ObjectType()
export class FeaturedSupportQNAs {
  @Field(() => ID)
  id!: string

  @Field(() => String, { nullable: true })
  renderedTitle?: string

  @Field(() => Link, { nullable: true })
  link?: Link | null

  @Field(() => [SupportQNA], { nullable: true })
  supportQNAs?: SupportQNA[]

  @Field(() => [SupportQNA])
  resolvedSupportQNAs!: GetFeaturedSupportQNAsInput

  @Field(() => Boolean, { nullable: true })
  automaticallyFetchSupportQNAs?: boolean
}

export const mapFeaturedSupportQNAs = ({
  sys,
  fields,
}: IFeaturedSupportQnAs) => ({
  typename: 'FeaturedSupportQNAs',
  id: sys.id,
  renderedTitle: fields.renderedTitle ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  supportQNAs: (fields.supportQNAs ?? []).map(mapSupportQNA),
  automaticallyFetchSupportQNAs: fields.automaticallyFetchSupportQNAs ?? false,
  resolvedSupportQNAs: {
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    organization: fields.organization?.fields?.slug,
    category: fields.supportCategory?.fields.slug,
    subCategory: fields.supportSubcategory?.fields.slug,
    size: fields.automaticallyFetchSupportQNAs
      ? fields.supportQnaCount ?? 5
      : 0,
  },
})
