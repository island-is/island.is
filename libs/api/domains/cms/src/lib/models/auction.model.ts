import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IAuction } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'

@ObjectType()
export class Auction {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  updatedAt: string

  @Field()
  date: string

  @Field()
  type: string

  @Field({ nullable: true })
  content?: string

  @Field(() => Organization)
  organization: Organization
}

export const mapAuction = ({ fields, sys }: IAuction): Auction => ({
  id: sys.id,
  updatedAt: sys.updatedAt,
  title: fields.title ?? '',
  date: fields.date ?? '',
  type: fields.type ?? '',
  content: fields.content ?? '',
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
})
