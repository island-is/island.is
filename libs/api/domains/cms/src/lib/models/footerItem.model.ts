import { Field, ObjectType } from '@nestjs/graphql'

import { IFooterItem } from '../generated/contentfulTypes'

@ObjectType()
export class FooterItem {
  @Field()
  title: string

  @Field({ nullable: true })
  content?: string
}

export const mapFooterItem = ({ fields }: IFooterItem): FooterItem => ({
  title: fields.title,
  content: fields.content ?? '',
})
