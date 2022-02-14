import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IFrontpage } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'
import { FrontpageSlider, mapFrontpageSlider } from './frontpageSlider.model'
import { LifeEventPage, mapLifeEventPage } from './lifeEventPage.model'
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

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => [Image], { nullable: true })
  videos?: Array<Image>

  @Field(() => Image, { nullable: true })
  imageMobile?: Image | null

  @Field(() => [Image], { nullable: true })
  videosMobile?: Array<Image>

  @Field(() => [Featured])
  featured?: Array<Featured>

  @Field(() => [FrontpageSlider])
  slides?: Array<FrontpageSlider>

  @Field(() => Namespace, { nullable: true })
  namespace!: Namespace | null

  @Field(() => [LifeEventPage])
  lifeEvents?: Array<LifeEventPage>

  @Field(() => LinkList, { nullable: true })
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
  lifeEvents: (fields.lifeEvents ?? []).map(mapLifeEventPage),
  linkList: fields.linkList ? mapLinkList(fields.linkList) : null,
})
