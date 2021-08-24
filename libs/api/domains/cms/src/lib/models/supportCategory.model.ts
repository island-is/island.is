import { Field, ObjectType } from '@nestjs/graphql'

import { ISupportCategory } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'

@ObjectType()
export class SupportCategory {
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
}: ISupportCategory): SupportCategory => ({
  title: fields.title,
  description: fields.description ?? '',
  slug: fields.slug,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
})
