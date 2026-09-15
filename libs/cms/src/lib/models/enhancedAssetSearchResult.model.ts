import { ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { EnhancedAsset } from './enhancedAsset.model'

@ObjectType()
export class EnhancedAssetSearchResult {
  @CacheField(() => [EnhancedAsset])
  items!: EnhancedAsset[]

  @CacheField()
  total!: number
}
