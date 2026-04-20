import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class OrganizationPageStandaloneSitemapLink {
  @Field()
  label!: string

  @Field()
  href!: string

  @Field(() => String, { nullable: true })
  description?: string | null
}

@ObjectType()
export class OrganizationPageStandaloneSitemap {
  @CacheField(() => [OrganizationPageStandaloneSitemapLink])
  childLinks!: OrganizationPageStandaloneSitemapLink[]
}

@ObjectType()
export class OrganizationPageStandaloneSitemapLevel2Link {
  @Field()
  label!: string

  @Field()
  href!: string

  @Field(() => String, { nullable: true })
  description?: string | null
}

@ObjectType()
export class OrganizationPageStandaloneSitemapLevel2Category {
  @Field()
  label!: string

  @Field(() => String, { nullable: true })
  href?: string | null

  @CacheField(() => [OrganizationPageStandaloneSitemapLevel2Link])
  childLinks!: OrganizationPageStandaloneSitemapLevel2Link[]
}

@ObjectType()
export class OrganizationPageStandaloneSitemapLevel2 {
  @Field()
  label!: string

  @CacheField(() => [OrganizationPageStandaloneSitemapLevel2Category])
  childCategories!: OrganizationPageStandaloneSitemapLevel2Category[]
}
