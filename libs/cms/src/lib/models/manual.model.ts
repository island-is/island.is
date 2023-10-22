import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IManual } from '../generated/contentfulTypes'
import { Organization, mapOrganization } from './organization.model'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { ManualChapter, mapManualChapter } from './manualChapter.model'

@ObjectType()
export class Manual {
  @Field(() => ID)
  id!: string

  @CacheField(() => Organization, { nullable: true })
  organization?: Organization | null

  @Field()
  title!: string

  @Field()
  slug!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  description?: Array<typeof SliceUnion>

  @CacheField(() => [ManualChapter])
  chapters!: ManualChapter[]
}

export const mapManual = ({ sys, fields }: IManual): Manual => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  // TODO: What if this is empty?
  description: fields.description
    ? mapDocument(fields.description, sys.id + ':description')
    : [],
  // TODO: What if a chapter is unpublished but we publish a manual?
  chapters: fields.chapters ? fields.chapters.map(mapManualChapter) : [],
})
