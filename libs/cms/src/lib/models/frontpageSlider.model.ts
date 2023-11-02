import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { Html, mapHtml } from './html.model'
import { IFrontpageSlider } from '../generated/contentfulTypes'
import { Asset } from './asset.model'

@ObjectType()
export class FrontpageSlider {
  @Field()
  title!: string

  @Field()
  subtitle!: string

  @CacheField(() => Html, { nullable: true })
  intro?: Html | null

  @Field()
  content!: string

  @Field({ nullable: true })
  link?: string

  @CacheField(() => Asset, { nullable: true })
  animationJsonAsset?: Asset | null
}

export const mapFrontpageSlider = ({
  sys,
  fields,
}: IFrontpageSlider): FrontpageSlider => ({
  title: fields.title ?? '',
  subtitle: fields.subtitle ?? '',
  intro: (fields.intro && mapHtml(fields.intro, sys.id + ':intro')) ?? null,
  content: fields.content ?? '',
  link: fields.link ? JSON.stringify(fields.link) : '',
  animationJsonAsset: {
    id: fields.animationJsonAsset?.sys.id ?? '',
    typename: 'AnimationJson',
    url: fields.animationJsonAsset?.fields?.file.url ?? '',
  },
})
