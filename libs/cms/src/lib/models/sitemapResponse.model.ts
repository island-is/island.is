import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SitemapTreeNode, SitemapTreeNodeType } from '@island.is/shared/types'

@ObjectType()
export class SitemapLink {
  @Field()
  label!: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field()
  href!: string

  @CacheField(() => [SitemapLink])
  childLinks!: SitemapLink[]
}

@ObjectType()
export class SitemapResponse {
  @CacheField(() => [SitemapLink])
  links!: SitemapLink[]
}

export const mapSitemapLink = (
  node: SitemapTreeNode & { label?: string; href?: string },
  parentSlugs?: string[],
): SitemapLink | null => {
  if (node.type === SitemapTreeNodeType.URL) {
    return {
      label: node.label,
      href: node.url,
      childLinks: [],
    }
  }

  if (node.type === SitemapTreeNodeType.ENTRY) {
    if (!node.label || !node.href) {
      return null
    }
    return {
      label: node.label,
      href: node.href,
      childLinks: [],
    }
  }

  if (node.type === SitemapTreeNodeType.CATEGORY) {
    const childLinks = node.childNodes
      .map((child) =>
        mapSitemapLink(child, (parentSlugs ?? []).concat(node.slug)),
      )
      .filter(Boolean) as SitemapLink[]
    return {
      label: node.label,
      href: `/${(parentSlugs ?? []).concat(node.slug).join('/')}`,
      description: node.description,
      childLinks,
    }
  }

  return null
}
