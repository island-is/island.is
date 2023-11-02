import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { ISupportCategory } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'

@ObjectType()
export class SupportCategory {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @CacheField(() => Organization, { nullable: true })
  organization?: Organization | null

  @Field({ nullable: true })
  slug?: string

  @Field()
  importance!: number
}

export const mapSupportCategory = ({
  fields,
  sys,
}: ISupportCategory): SupportCategory => ({
  id: sys.id,
  title: fields.title,
  description: fields.description ?? '',
  slug: fields.slug,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  importance: fields.importance ?? 0,
})
