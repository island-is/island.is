import { Field, ObjectType } from '@nestjs/graphql'

import { ITabContent } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Html, mapHtml } from './html.model'

@ObjectType()
export class TabContent {
  @Field()
  tabTitle: string

  @Field({ nullable: true })
  contentTitle?: string

  @Field({ nullable: true })
  image?: Image

  @Field(() => Html, { nullable: true })
  body?: Html
}

export const mapTabContent = ({ sys, fields }: ITabContent): TabContent => ({
  tabTitle: fields.tabTitle,
  contentTitle: fields.contentTitle ?? '',
  image: fields.image && mapImage(fields.image),
  body: (fields.body && mapHtml(fields.body, sys.id + ':body')) ?? null,
})
