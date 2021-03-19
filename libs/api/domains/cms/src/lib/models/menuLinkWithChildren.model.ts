import { Field, ObjectType } from '@nestjs/graphql'
import { IMenuLinkWithChildren } from '../generated/contentfulTypes'
import { mapMenuLink, MenuLink } from './menuLink.model'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class MenuLinkWithChildren {
  @Field()
  title!: string

  @Field(() => ReferenceLink, { nullable: true })
  link?: ReferenceLink | null

  @Field(() => [MenuLink])
  childLinks?: MenuLink[]
}

export const mapMenuLinkWithChildren = ({
  fields,
}: IMenuLinkWithChildren): MenuLinkWithChildren => ({
  title: fields.title ?? '',
  link: fields.link ? mapReferenceLink(fields.link) : null,
  childLinks: (fields.childLinks ?? []).map(mapMenuLink),
})
