import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ILinkList } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'

@ObjectType()
export class LinkList {
  @Field()
  title?: string

  @CacheField(() => [Link])
  links!: Array<Link>
}

export const mapLinkList = ({ fields }: ILinkList): LinkList => ({
  title: fields.title ?? '',
  links: (fields.links ?? []).map(mapLink),
})
