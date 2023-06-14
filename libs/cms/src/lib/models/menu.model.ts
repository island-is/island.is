import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IMenu } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import {
  mapMenuLinkWithChildren,
  MenuLinkWithChildren,
} from './menuLinkWithChildren.model'

@ObjectType()
export class Menu {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title = ''

  @CacheField(() => [Link])
  links?: Link[]

  @CacheField(() => [MenuLinkWithChildren])
  menuLinks?: MenuLinkWithChildren[]
}

export const mapMenu = ({ sys, fields }: IMenu): Menu => ({
  id: sys.id,
  title: fields.title ?? '',
  links: (fields.links ?? []).map(mapLink),
  menuLinks: (fields.menuLinks ?? []).map(mapMenuLinkWithChildren),
})
