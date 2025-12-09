import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'
import type { SystemMetadata } from '@island.is/shared/types'
import type { IOrganizationParentSubpage } from '../generated/contentfulTypes'

@ObjectType()
class OrganizationSubpageLink {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field()
  label!: string

  @Field()
  href!: string
}

@ObjectType()
export class OrganizationParentSubpage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  shortTitle?: string

  @CacheField(() => [OrganizationSubpageLink])
  childLinks!: OrganizationSubpageLink[]

  @Field(() => String, { nullable: true })
  href?: string

  @Field(() => String, { nullable: true })
  organizationPageTitle?: string

  @Field(() => String, { nullable: true })
  intro?: string
}

export const mapOrganizationParentSubpage = ({
  sys,
  fields,
}: IOrganizationParentSubpage): SystemMetadata<OrganizationParentSubpage> => {
  let href = undefined
  if (fields.organizationPage?.fields?.slug) {
    href = `/${getOrganizationPageUrlPrefix(sys.locale)}/${
      fields.organizationPage.fields.slug
    }/${fields.slug ?? ''}`
  }
  return {
    typename: 'OrganizationParentSubpage',
    id: sys.id,
    title: fields.title,
    shortTitle: fields.shortTitle ?? '',
    href,
    organizationPageTitle: fields.organizationPage?.fields?.title ?? '',
    intro: '', // Populated by search (includes the highlighted content that matched the search query)
    childLinks:
      fields.pages
        ?.filter(
          (page) =>
            // Child pages should belong to the same organization page
            page.fields.organizationPage?.sys?.id ===
              fields.organizationPage?.sys?.id &&
            Boolean(page.fields.organizationPage?.fields?.slug) &&
            Boolean(page.fields.slug) &&
            Boolean(page.fields.title),
        )
        .map((page) => ({
          id: page.sys.id,
          label: page.fields.title,
          href: `/${getOrganizationPageUrlPrefix(sys.locale)}/${
            page.fields.organizationPage.fields.slug
          }/${fields.slug}/${page.fields.slug}`,
        })) ?? [],
  }
}
