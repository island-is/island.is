import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IMenuLinkWithChildren } from '../generated/contentfulTypes'
import { mapMenuLink, MenuLink } from './menuLink.model'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class MenuLinkWithChildren {
  @Field()
  title!: string

  @CacheField(() => ReferenceLink, { nullable: true })
  link?: ReferenceLink | null

  @CacheField(() => [MenuLink])
  childLinks?: MenuLink[]
}

export const mapMenuLinkWithChildren = ({
  fields,
}: IMenuLinkWithChildren): MenuLinkWithChildren => ({
  title: fields.title ?? '',
  link: fields.link ? mapReferenceLink(fields.link) : null,
  childLinks: (fields.childLinks ?? [])
    .map(mapMenuLink)
    .filter((childLink) => !!childLink?.link?.slug && !!childLink?.title),
})
