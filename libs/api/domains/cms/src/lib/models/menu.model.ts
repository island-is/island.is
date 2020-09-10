import { Field, ObjectType } from '@nestjs/graphql'

import { IMenu } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'

@ObjectType()
export class Menu {
  @Field()
  title: string

  @Field(() => [Link])
  links: Link[]
}

export const mapMenu = ({ fields }: IMenu): Menu => ({
  title: fields.title ?? '',
  links: fields.links.map(mapLink),
})
