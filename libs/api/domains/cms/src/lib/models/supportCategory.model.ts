import { Field, ObjectType } from '@nestjs/graphql'

import { ISupportCategory } from '../generated/contentfulTypes'

@ObjectType()
export class SupportCategory {
  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug!: string
}

export const mapSupportCategory = ({
  fields,
}: ISupportCategory): SupportCategory => ({
  title: fields.title,
  description: fields.description ?? '',
  slug: fields.slug,
})
