import { Field, ObjectType } from '@nestjs/graphql'

import { IFooterItem } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'

@ObjectType()
export class FooterItem {
  @Field()
  title: string

  @Field(() => Link, { nullable: true })
  link: Link

  @Field({ nullable: true })
  content?: string
}

export const mapFooterItem = ({ fields }: IFooterItem): FooterItem => ({
  title: fields.title ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  content: fields.content ?? '',
})
