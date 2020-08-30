import { Field, ObjectType } from '@nestjs/graphql'
import { Image, mapImage } from './image.model'
import {IFrontpageSlider} from '../generated/contentfulTypes'

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
}

export const mapFrontpageSlide = ({
  fields,
}: IFrontpageSlider): FrontpageSlide => ({
  title: fields.title,
  subtitle: fields.subtitle,
  content: fields.content,
  image: fields.image && mapImage(fields.image),
  link: fields.link && JSON.stringify(fields.link),
})
