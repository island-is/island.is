import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ISupportQna } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

import { mapOrganization, Organization } from './organization.model'
import { mapSupportCategory, SupportCategory } from './supportCategory.model'
import {
  mapSupportSubCategory,
  SupportSubCategory,
} from './supportSubCategory.model'

@ObjectType()
export class SupportQNA {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => [SliceUnion])
  answer: Array<typeof SliceUnion> = []

  @Field()
  slug!: string

  @Field(() => Organization, { nullable: true })
  organization!: Organization | null

  @Field(() => SupportCategory, { nullable: true })
  category!: SupportCategory | null

  @Field(() => SupportSubCategory, { nullable: true })
  subCategory!: SupportSubCategory | null
}

export const mapSupportQNA = ({ fields, sys }: ISupportQna): SupportQNA => ({
  id: sys.id,
  title: fields.question,
  answer: fields.answer ? mapDocument(fields.answer, sys.id) : [],
  slug: fields.slug,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  category: fields.category ? mapSupportCategory(fields.category) : null,
  subCategory: fields.subCategory
    ? mapSupportSubCategory(fields.subCategory)
    : null,
})
