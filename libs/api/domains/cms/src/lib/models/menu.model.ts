import { Field, ObjectType } from '@nestjs/graphql'
import { Link, mapLink } from './link.model'
import { IMenu } from '../generated/contentfulTypes'

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
