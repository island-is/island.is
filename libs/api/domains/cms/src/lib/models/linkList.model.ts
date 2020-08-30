import { Field, ObjectType } from '@nestjs/graphql'
import { Link, mapLink } from './link.model'
import { ILinkList } from '../generated/contentfulTypes'

@ObjectType()
export class LinkList {
  @Field()
  title: string

  @Field(() => [Link])
  links: Array<Link>
}

export const mapLinkList = ({ fields }: ILinkList): LinkList => ({
  title: fields.title ?? '',
  links: fields.links.map(mapLink),
})
