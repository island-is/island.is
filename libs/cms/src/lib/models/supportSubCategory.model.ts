import { Field, ObjectType } from '@nestjs/graphql'

import { ISupportSubCategory } from '../generated/contentfulTypes'

@ObjectType()
export class SupportSubCategory {
  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug!: string
}

export const mapSupportSubCategory = ({
  fields,
}: ISupportSubCategory): SupportSubCategory => ({
  title: fields.title,
  description: fields.description ?? '',
  slug: fields.slug,
})
