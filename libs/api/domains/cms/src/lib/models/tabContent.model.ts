import { Field, ObjectType } from '@nestjs/graphql'
import { ITabContent } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Html, mapHtml } from './html.model'

@ObjectType()
export class TabContent {
  @Field()
  tabTitle!: string

  @Field({ nullable: true })
  contentTitle?: string

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => Html, { nullable: true })
  body?: Html | null
}

export const mapTabContent = ({ sys, fields }: ITabContent): TabContent => ({
  tabTitle: fields.tabTitle ?? '',
  contentTitle: fields.contentTitle ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  body: fields.body ? mapHtml(fields.body, sys.id + ':body') : null,
})
