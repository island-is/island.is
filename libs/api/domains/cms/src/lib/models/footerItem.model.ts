import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IFooterItem } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class FooterItem {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => Link, { nullable: true })
  link: Link

  @Field({ nullable: true })
  content?: string

  @Field(() => [SliceUnion], { nullable: true })
  contentTest: Array<typeof SliceUnion>
}

export const mapFooterItem = ({ fields, sys }: IFooterItem): FooterItem => ({
  id: sys.id,
  title: fields.title ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  content: fields.content ?? '',
  contentTest: fields.contentTest
    ? mapDocument(fields.contentTest, sys.id + ':content')
    : [],
})
