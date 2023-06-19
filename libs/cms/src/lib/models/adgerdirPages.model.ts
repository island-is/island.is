import { ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { AdgerdirPage } from './adgerdirPage.model'

@ObjectType()
export class AdgerdirPages {
  @CacheField(() => [AdgerdirPage])
  items!: AdgerdirPage[]
}
