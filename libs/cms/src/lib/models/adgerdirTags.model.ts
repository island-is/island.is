import { ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { AdgerdirTag } from './adgerdirTag.model'

@ObjectType()
export class AdgerdirTags {
  @CacheField(() => [AdgerdirTag])
  items?: AdgerdirTag[]
}
