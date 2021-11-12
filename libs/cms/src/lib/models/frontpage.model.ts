import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IFrontpage } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'
import { FrontpageSlider, mapFrontpageSlider } from './frontpageSlider.model'
import { LifeEventPage, mapLifeEventPage } from './lifeEventPage.model'
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

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => [Featured])
  featured?: Array<Featured>

  @Field(() => [FrontpageSlider])
  slides?: Array<FrontpageSlider>

  @Field(() => Namespace, { nullable: true })
  namespace!: Namespace | null

  @Field(() => [LifeEventPage])
  lifeEvents?: Array<LifeEventPage>
}

export const mapFrontpage = ({ fields, sys }: IFrontpage): Frontpage => ({
  id: sys.id,
  title: fields.title ?? '',
  heading: fields.heading ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  featured: (fields.featured ?? []).map(mapFeatured),
  slides: (fields.slides ?? []).map(mapFrontpageSlider),
  namespace: fields.namespace ? mapNamespace(fields.namespace) : null,
  lifeEvents: (fields.lifeEvents ?? []).map(mapLifeEventPage),
})
