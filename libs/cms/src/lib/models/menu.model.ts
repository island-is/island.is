import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IMenu } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import {
  mapMenuLinkWithChildren,
  MenuLinkWithChildren,
} from './menuLinkWithChildren.model'
import { getArrayOrEmptyArrayFallback } from './utils'

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
  links: getArrayOrEmptyArrayFallback(fields.links).map(mapLink),
  menuLinks: getArrayOrEmptyArrayFallback(fields.menuLinks).map(
    mapMenuLinkWithChildren,
  ),
})
