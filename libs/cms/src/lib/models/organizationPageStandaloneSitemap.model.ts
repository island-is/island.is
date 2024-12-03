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
