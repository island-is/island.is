/*
  TODO: refactor when Articles has been refactored

  This model, article reference, is here because of a Webpack circularity issue
  The subArticle model points to this instead of an article model.

  When articles no longer have references to their children, this can be
  removed and the subArticle model made to reference the article model
  directly
*/
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IArticle } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { ArticleGroup, mapArticleGroup } from './articleGroup.model'
import { mapOrganization, Organization } from './organization.model'

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

  @Field(() => ArticleGroup, { nullable: true })
  group?: ArticleGroup | null

  @Field(() => [Organization], { nullable: true })
  organization?: Array<Organization>
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
  group: fields.group ? mapArticleGroup(fields.group) : null,
  organization: (fields.organization ?? [])
    .filter(
      (organization) => organization.fields?.title && organization.fields?.slug,
    )
    .map(mapOrganization),
})
