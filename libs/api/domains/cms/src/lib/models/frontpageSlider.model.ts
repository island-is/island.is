import { Field, ObjectType } from '@nestjs/graphql'
import { Html, mapHtml } from './html.model'
import { IFrontpageSlider } from '../generated/contentfulTypes'

@ObjectType()
export class FrontpageSlider {
  @Field()
  title: string

  @Field()
  subtitle: string

  @Field(() => Html, { nullable: true })
  intro: Html

  @Field()
  content: string

  @Field({ nullable: true })
  link?: string

  @Field({ nullable: true })
  animationJson?: string
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
  animationJson: fields.animationJson
    ? JSON.stringify(fields.animationJson)
    : '',
})
