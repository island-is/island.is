import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  SitemapTree as CmsTree,
  SitemapTreeNode as CmsTreeNode,
  SitemapTreeNodeType,
} from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'
import { ISitemap } from '../generated/contentfulTypes'

registerEnumType(SitemapTreeNodeType, {
  name: 'SitemapTreeNodeType',
})

@ObjectType()
class SitemapTreeNode {
  @Field(() => Int)
  id!: number

  @CacheField(() => SitemapTreeNodeType)
  type!: SitemapTreeNodeType

  @Field()
  label!: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  description?: string | null

  @Field({ nullable: true })
  url?: string | null

  @CacheField(() => [SitemapTreeNode])
  childNodes!: CmsTreeNode[]
}

@ObjectType()
export class Sitemap {
  @Field(() => ID)
  id!: string

  @CacheField(() => [SitemapTreeNode])
  childNodes!: CmsTreeNode[]
}

export const mapSitemap = ({ sys, fields }: ISitemap): Sitemap => {
  return {
    id: sys.id,
    childNodes: (fields?.tree as CmsTree)?.childNodes ?? [],
  }
}
