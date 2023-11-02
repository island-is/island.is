import { ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { OrganizationTag } from './organizationTag.model'

@ObjectType()
export class OrganizationTags {
  @CacheField(() => [OrganizationTag])
  items?: OrganizationTag[]
}
