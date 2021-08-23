import { Field, ObjectType } from '@nestjs/graphql'
import { Html, mapHtml } from './html.model'
import { IFrontpageSlider } from '../generated/contentfulTypes'
import { Asset } from './asset.model'

@ObjectType()
export class FrontpageSlider {
  @Field()
  title!: string

  @Field()
  subtitle!: string

  @Field(() => Html, { nullable: true })
  intro?: Html | null

  @Field()
  content!: string

  @Field({ nullable: true })
  link?: string

  @Field(() => Asset, { nullable: true })
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
