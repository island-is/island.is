import { Field, ObjectType } from '@nestjs/graphql'
import { IIntroLinkImage } from '../generated/contentfulTypes'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'
import { Html, mapHtml } from './html.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class IntroLinkImage {
  @Field()
  title?: string

  @Field(() => Html)
  intro?: Html

  @Field(() => Image, { nullable: true })
  image!: Image

  @Field(() => Boolean)
  leftImage?: boolean

  @Field()
  linkTitle!: string

  @Field(() => ReferenceLink)
  link!: ReferenceLink | null
}

export const mapIntroLinkImage = ({
  fields,
  sys,
}: IIntroLinkImage): IntroLinkImage => ({
  title: fields.title ?? '',
  intro: (fields.intro && mapHtml(fields.intro, sys.id + ':intro')) ?? null,
  image: mapImage(fields.image),
  leftImage: fields.leftImage ?? false,
  linkTitle: fields.linkTitle ?? '',
  link: fields.link ? mapReferenceLink(fields.link) : null,
})
