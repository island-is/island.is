import { Field, ObjectType } from '@nestjs/graphql'

import { IFrontpageSlider } from '../generated/contentfulTypes'

import { Image, mapImage } from './image.model'
import { File, mapFile } from './file.model'

@ObjectType()
export class FrontpageSlide {
  @Field()
  title: string

  @Field()
  subtitle: string

  @Field()
  content: string

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field({ nullable: true })
  link?: string

  @Field(() => File, { nullable: true })
  animationZip?: File
}

export const mapFrontpageSlide = ({
  fields,
}: IFrontpageSlider): FrontpageSlide => ({
  title: fields.title,
  subtitle: fields.subtitle,
  content: fields.content,
  image: fields.image && mapImage(fields.image),
  link: fields.link && JSON.stringify(fields.link),
  animationZip: fields.animationZip && mapFile(fields.animationZip),
})
