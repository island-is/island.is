import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IAuction } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class Auction {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  updatedAt!: string

  @Field()
  date?: string

  @Field()
  type!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @CacheField(() => Organization)
  organization!: Organization | null
}

export const mapAuction = ({ fields, sys }: IAuction): Auction => ({
  id: sys.id,
  updatedAt: sys.updatedAt,
  title: fields.title ?? '',
  date: fields.date ?? '',
  type: fields.type ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
})
