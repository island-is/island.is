import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { getProjectPageUrlPrefix } from '@island.is/shared/utils'
import type { IProjectParentSubpage } from '../generated/contentfulTypes'

@ObjectType()
export class ProjectSubpageLink {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field()
  label!: string

  @Field()
  href!: string
}

@ObjectType()
export class ProjectParentSubpage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  shortTitle?: string

  @Field()
  slug!: string

  @CacheField(() => [ProjectSubpageLink])
  childLinks!: ProjectSubpageLink[]

  @Field(() => String, { nullable: true })
  href?: string

  @Field(() => String, { nullable: true })
  projectPageTitle?: string
}

export const mapProjectParentSubpage = ({
  sys,
  fields,
}: IProjectParentSubpage): ProjectParentSubpage => {
  const slug = (fields.slug ?? '').trim()
  const projectPageSlug = fields.projectPage?.fields?.slug
  const baseUrl = projectPageSlug
    ? `/${getProjectPageUrlPrefix(sys.locale)}/${projectPageSlug}/${slug}`
    : undefined

  return {
    id: sys.id,
    title: fields.title ?? '',
    shortTitle: fields.shortTitle || fields.title,
    slug,
    href: baseUrl,
    projectPageTitle: fields.projectPage?.fields?.title ?? '',
    childLinks: baseUrl
      ? fields.pages
          ?.filter(
            (page) =>
              // Child pages should belong to the same project page
              page?.fields?.projectPage?.sys?.id ===
                fields.projectPage?.sys?.id &&
              Boolean(page.fields.slug) &&
              Boolean(page.fields.title),
          )
          .map((page) => ({
            id: page.sys.id,
            label: page.fields.title,
            href: `${baseUrl}/${page.fields.slug.trim()}`,
          })) ?? []
      : [],
  }
}
