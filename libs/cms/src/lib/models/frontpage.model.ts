import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IFrontpage } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'
import { FrontpageSlider, mapFrontpageSlider } from './frontpageSlider.model'
import { AnchorPage, mapAnchorPage } from './anchorPage.model'
import { LinkList, mapLinkList } from './linkList.model'
import { mapNamespace, Namespace } from './namespace.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class Frontpage {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title!: string

  @Field({ nullable: true })
  heading!: string

  @Field({ nullable: true })
  imageAlternativeText!: string

  @CacheField(() => Image, { nullable: true })
  image?: Image | null

  @CacheField(() => [Image], { nullable: true })
  videos?: Array<Image>

  @CacheField(() => Image, { nullable: true })
  imageMobile?: Image | null

  @CacheField(() => [Image], { nullable: true })
  videosMobile?: Array<Image>

  @CacheField(() => [Featured])
  featured?: Array<Featured>

  @CacheField(() => [FrontpageSlider])
  slides?: Array<FrontpageSlider>

  @CacheField(() => Namespace, { nullable: true })
  namespace!: Namespace | null

  @CacheField(() => [AnchorPage])
  lifeEvents?: Array<AnchorPage>

  @CacheField(() => LinkList, { nullable: true })
  linkList?: LinkList | null
}

export const mapFrontpage = ({ fields, sys }: IFrontpage): Frontpage => ({
  id: sys.id,
  title: fields.title ?? '',
  heading: fields.heading ?? '',
  imageAlternativeText: fields.imageAlternativeText ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  videos: (fields.videos ?? []).map(mapImage),
  imageMobile: fields.imageMobile ? mapImage(fields.imageMobile) : null,
  videosMobile: (fields.videosMobile ?? []).map(mapImage),
  featured: (fields.featured ?? []).map(mapFeatured),
  slides: (fields.slides ?? []).map(mapFrontpageSlider),
  namespace: fields.namespace ? mapNamespace(fields.namespace) : null,
  lifeEvents: (fields.anchorPages ?? []).map(mapAnchorPage),
  linkList: fields.linkList ? mapLinkList(fields.linkList) : null,
})
