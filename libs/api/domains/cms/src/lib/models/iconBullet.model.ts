import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IIconBullet } from '../generated/contentfulTypes'

import { Image, mapImage } from './image.model'

@ObjectType()
export class IconBullet {
  constructor(initializer: IconBullet) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field(() => Image)
  icon: Image

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  linkText?: string
}

export const mapIconBullet = ({ fields, sys }: IIconBullet): IconBullet =>
  new IconBullet({
    id: sys.id,
    title: fields.title,
    body: fields.body,
    icon: mapImage(fields.icon),
    url: fields.url,
    linkText: fields.linkText,
  })
