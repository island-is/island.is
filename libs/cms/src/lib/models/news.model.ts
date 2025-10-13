import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { INews } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Organization, mapOrganization } from './organization.model'
import { EmbeddedVideo, mapEmbeddedVideo } from './embeddedVideo.model'

@ObjectType()
export class News {
  @Field(() => ID)
  id!: string

  @Field()
  slug!: string

  @Field()
  title!: string

  @Field()
  subtitle!: string

  @Field({ nullable: true })
  intro!: string

  @CacheField(() => Image, { nullable: true })
  image!: Image

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null

  @Field()
  date!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content: Array<typeof SliceUnion> = []

  @CacheField(() => [GenericTag])
  genericTags: GenericTag[] = []

  @Field({ nullable: true })
  imageText?: string

  @Field(() => Boolean, { nullable: true })
  fullWidthImageInContent?: boolean

  @Field({ nullable: true })
  initialPublishDate?: string

  @CacheField(() => Organization, { nullable: true })
  organization?: Organization

  @CacheField(() => EmbeddedVideo, { nullable: true })
  signLanguageVideo?: EmbeddedVideo | null
}

export const mapNews = ({ fields, sys }: INews): News => ({
  id: sys.id,
  slug: fields.slug ?? '',
  title: fields.title ?? '',
  subtitle: fields.subtitle ?? '',
  intro: fields.intro ?? '',
  image: mapImage(fields.image),
  date: fields.date ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  genericTags: (fields.genericTags ?? []).map(mapGenericTag),
  imageText: fields.imageText,
  fullWidthImageInContent: fields.fullWidthImageInContent ?? true,
  initialPublishDate: fields.initialPublishDate ?? '',
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : undefined,
  signLanguageVideo: fields.signLanguageVideo
    ? mapEmbeddedVideo(fields.signLanguageVideo)
    : null,
})
