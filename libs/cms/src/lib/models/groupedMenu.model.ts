import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IGroupedMenu } from '../generated/contentfulTypes'
import { Menu, mapMenu } from './menu.model'
import { getArrayOrEmptyArrayFallback } from './utils'

@ObjectType()
export class GroupedMenu {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [Menu])
  menus?: Menu[]
}

export const mapGroupedMenu = ({ sys, fields }: IGroupedMenu): GroupedMenu => ({
  id: sys.id,
  title: fields.title ?? '',
  menus: getArrayOrEmptyArrayFallback(fields.menus).map(mapMenu),
})
