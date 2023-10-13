/*
  TODO: refactor when Articles has been refactored

  This model, article reference, is here because of a Webpack circularity issue
  The subArticle model points to this instead of an article model.

  When articles no longer have references to their children, this can be
  removed and the subArticle model made to reference the article model
  directly
*/
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IArticle } from '../generated/contentfulTypes'
import { ArticleGroup, mapArticleGroup } from './articleGroup.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { mapOrganization, Organization } from './organization.model'
import { ArticleCategory, mapArticleCategory } from './articleCategory.model'
import { mapProcessEntry, ProcessEntry } from './processEntry.model'

@ObjectType()
export class ArticleReference {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  slug?: string

  @Field()
  intro?: string

  @CacheField(() => [SliceUnion], { nullable: true })
  body?: Array<typeof SliceUnion> = []

  @CacheField(() => ArticleGroup, { nullable: true })
  group?: ArticleGroup | null

  @CacheField(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory | null

  @CacheField(() => [Organization], { nullable: true })
  organization?: Array<Organization>

  @CacheField(() => ProcessEntry, { nullable: true })
  processEntry?: ProcessEntry | null

  @Field()
  processEntryButtonText?: string
}

export const mapArticleReference = ({
  fields,
  sys,
}: IArticle): SystemMetadata<ArticleReference> => ({
  typename: 'Article',
  id: sys.id,
  title: fields?.title ?? '',
  slug: fields?.slug ?? '',
  intro: fields?.intro ?? '',
  body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
  group: fields?.group ? mapArticleGroup(fields.group) : null,
  category: fields?.category ? mapArticleCategory(fields.category) : null,
  organization: (fields?.organization ?? [])
    .filter(
      (organization) => organization.fields?.title && organization.fields?.slug,
    )
    .map(mapOrganization),
  processEntry: fields.processEntry
    ? mapProcessEntry(fields.processEntry)
    : null,
  processEntryButtonText: fields.processEntryButtonText ?? '',
})
