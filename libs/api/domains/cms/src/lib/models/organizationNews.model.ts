import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOrganizationNews } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { mapOrganization, Organization } from './organization.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class OrganizationNews {
  @Field(() => ID)
  id: string

  @Field(() => Organization)
  organization: Organization

  @Field()
  title: string

  @Field({ nullable: true })
  date?: string

  @Field()
  introduction: string

  @Field({ nullable: true })
  featuredImage?: Image

  @Field(() => [SliceUnion])
  content: Array<typeof SliceUnion>

  @Field()
  slug: string
}

export const mapOrganizationNews = ({
  sys,
  fields,
}: IOrganizationNews): OrganizationNews => ({
  id: sys.id,
  organization: mapOrganization(fields.organization),
  title: fields.title,
  date: fields.date ?? '',
  introduction: fields.introduction,
  featuredImage: mapImage(fields.featuredImage),
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':body')
    : null,
  slug: fields.slug,
})
