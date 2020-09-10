import { Field, ObjectType } from '@nestjs/graphql'

import { IOrganization } from '../generated/contentfulTypes'

@ObjectType()
export class Organization {
  @Field()
  title: string

  @Field()
  slug: string
}

export const mapOrganization = ({ fields }: IOrganization): Organization => ({
  title: fields.title,
  slug: fields.slug,
})
