import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ISectionWithImage } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Html, mapHtml } from './html.model'

@ObjectType()
export class SectionWithImage {
  constructor(initializer: SectionWithImage) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  image?: Image

  @Field(() => Html)
  html: Html
}

export const mapSectionWithImage = ({
  fields,
  sys,
}: ISectionWithImage): SectionWithImage =>
  new SectionWithImage({
    id: sys.id,
    title: fields.title ?? '',
    image: fields.image?.fields?.file ? mapImage(fields.image) : null,
    html: mapHtml(fields.body, sys.id + ':html'),
  })
