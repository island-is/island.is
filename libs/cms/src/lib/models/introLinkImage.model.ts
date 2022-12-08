import { Field, ObjectType } from '@nestjs/graphql'
import { IIntroLinkImage } from '../generated/contentfulTypes'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'
import { Html, mapHtml } from './html.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class IntroLinkImage {
  @Field()
  title?: string

  @Field(() => Html, { nullable: true })
  intro?: Html

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => Boolean)
  leftImage?: boolean

  @Field()
  linkTitle?: string

  @Field(() => ReferenceLink, { nullable: true })
  link?: ReferenceLink | null

  @Field(() => Boolean)
  openLinkInNewTab?: boolean
}

export const mapIntroLinkImage = ({
  fields,
  sys,
}: IIntroLinkImage): IntroLinkImage => ({
  title: fields.title ?? '',
  intro: (fields.intro && mapHtml(fields.intro, sys.id + ':intro')) ?? null,
  image: fields.image ? mapImage(fields.image) : null,
  leftImage: fields.leftImage ?? false,
  linkTitle: fields.linkTitle ?? '',
  link: fields.link ? mapReferenceLink(fields.link) : null,
  openLinkInNewTab: fields.openLinkInNewTab ?? true,
})
