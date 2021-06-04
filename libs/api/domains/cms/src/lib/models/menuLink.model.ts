import { Field, ObjectType } from '@nestjs/graphql'
import { IMenuLink } from '../generated/contentfulTypes'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class MenuLink {
  @Field()
  title!: string

  @Field(() => ReferenceLink)
  link?: ReferenceLink | null
}

export const mapMenuLink = ({ fields }: IMenuLink): MenuLink => ({
  title: fields.title ?? '',
  link: fields.link ? mapReferenceLink(fields.link) : null,
})
