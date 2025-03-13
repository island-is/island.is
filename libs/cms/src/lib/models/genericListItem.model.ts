import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { GenericList, mapGenericList } from './genericList.model'
import { IGenericListItem } from '../generated/contentfulTypes'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class GenericListItem {
  @Field(() => ID)
  id!: string

  @CacheField(() => GenericList, { nullable: true })
  genericList?: GenericList

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  date?: string | null

  @CacheField(() => [SliceUnion])
  cardIntro: Array<typeof SliceUnion> = []

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => String, { nullable: true })
  assetUrl?: string

  @Field(() => String, { nullable: true })
  externalUrl?: string

  @CacheField(() => [GenericTag], { nullable: true })
  filterTags?: GenericTag[]

  @CacheField(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => Boolean, { nullable: true })
  fullWidthImageInContent?: boolean
}

export const mapGenericListItem = ({
  fields,
  sys,
}: IGenericListItem): GenericListItem => {
  let assetUrl = fields.asset?.fields?.file?.url ?? ''

  // The asset url might not contain a protocol that's why we prepend https:
  // https://www.contentful.com/developers/docs/concepts/images/
  if (assetUrl.startsWith('//')) {
    assetUrl = `https:${assetUrl}`
  }

  return {
    id: sys.id,
    genericList: fields.genericList
      ? mapGenericList(fields.genericList)
      : undefined,
    title: fields.title ?? '',
    date: fields.date || null,
    cardIntro: fields.cardIntro
      ? mapDocument(fields.cardIntro, `${sys.id}:cardIntro`)
      : [],
    content: fields.content
      ? mapDocument(fields.content, `${sys.id}:content`)
      : [],
    slug: fields.slug,
    assetUrl,
    externalUrl: fields.externalLink?.fields?.url ?? '',
    filterTags: fields.filterTags ? fields.filterTags.map(mapGenericTag) : [],
    image: fields.image ? mapImage(fields.image) : null,
    fullWidthImageInContent: fields.fullWidthImageInContent ?? true,
  }
}
