import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IFooterItem } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class FooterItem {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => Link, { nullable: true })
  link?: Link | null

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion], { nullable: true })
  serviceWebContent?: Array<typeof SliceUnion>
}

export const mapFooterItem = ({ fields, sys }: IFooterItem): FooterItem => ({
  id: sys.id,
  title: fields.title ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  serviceWebContent: fields.serviceWebContent
    ? mapDocument(fields.serviceWebContent, sys.id + ':serviceWebContent')
    : [],
})
