import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IMenuLink } from '../generated/contentfulTypes'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class MenuLink {
  @Field()
  title!: string

  @CacheField(() => ReferenceLink)
  link?: ReferenceLink | null
}

export const mapMenuLink = ({ fields }: IMenuLink): MenuLink => ({
  title: fields.title ?? '',
  link: fields.link ? mapReferenceLink(fields.link) : null,
})
