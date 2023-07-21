import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ILinkList } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { getArrayOrEmptyArrayFallback } from './utils'

@ObjectType()
export class LinkList {
  @Field()
  title?: string

  @CacheField(() => [Link])
  links!: Array<Link>
}

export const mapLinkList = ({ fields }: ILinkList): LinkList => ({
  title: fields.title ?? '',
  links: getArrayOrEmptyArrayFallback(fields.links).map(mapLink),
})
