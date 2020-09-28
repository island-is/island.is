import { Field, ObjectType } from '@nestjs/graphql'
import { Link, mapLink } from './link.model'
import { IFrontpageSlider } from '../generated/contentfulTypes'

@ObjectType()
export class FrontpageSlider {
  @Field()
  title: string

  @Field()
  subtitle: string

  @Field()
  content: string

  @Field({ nullable: true })
  animationJson?: string

  @Field(() => Link, { nullable: true })
  slideLink?: Link
}

export const mapFrontpageSlider = ({
  fields,
}: IFrontpageSlider): FrontpageSlider => ({
  title: fields.title,
  subtitle: fields.subtitle,
  content: fields.content,
  animationJson: fields.animationJson
    ? JSON.stringify(fields.animationJson)
    : '',
  slideLink: fields.slideLink ? mapLink(fields.slideLink) : null,
})
