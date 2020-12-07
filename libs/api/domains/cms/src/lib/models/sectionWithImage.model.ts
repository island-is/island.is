import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ISectionWithImage } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Html, mapHtml } from './html.model'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class SectionWithImage {
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
}: ISectionWithImage): SystemMetadata<SectionWithImage> => ({
  typename: 'SectionWithImage',
  id: sys.id,
  title: fields.title ?? '',
  image: fields.image?.fields?.file ? mapImage(fields.image) : null,
  html: fields.body && mapHtml(fields.body, sys.id + ':html'),
})
