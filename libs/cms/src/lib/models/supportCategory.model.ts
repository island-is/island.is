import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ISupportCategory } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'

@ObjectType()
export class SupportCategory {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Organization, { nullable: true })
  organization?: Organization | null

  @Field()
  slug!: string
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
})
