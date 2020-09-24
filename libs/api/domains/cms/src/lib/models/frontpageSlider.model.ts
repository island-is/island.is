import { Field, ObjectType } from '@nestjs/graphql'

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
  link?: string

  @Field({ nullable: true })
  animationJson?: string
}

export const mapFrontpageSlider = ({
  fields,
}: IFrontpageSlider): FrontpageSlider => ({
  title: fields.title,
  subtitle: fields.subtitle,
  content: fields.content,
  link: fields.link && JSON.stringify(fields.link),
  animationJson: fields.animationJson
    ? JSON.stringify(fields.animationJson)
    : '',
})
