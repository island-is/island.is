import { Field, ObjectType } from '@nestjs/graphql'

import { ITabContent } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class TabContent {
  @Field()
  tabTitle: string

  @Field({ nullable: true })
  contentTitle?: string

  @Field({ nullable: true })
  image?: Image

  @Field({ nullable: true })
  body?: string
}

export const mapTabContent = ({ fields }: ITabContent): TabContent => ({
  tabTitle: fields.tabTitle,
  contentTitle: fields.contentTitle ?? '',
  image: fields.image?.fields?.file ? mapImage(fields.image) : null,
  body: (fields.body && JSON.stringify(fields.body)) ?? null,
})
