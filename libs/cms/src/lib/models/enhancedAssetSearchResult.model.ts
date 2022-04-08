import { Field, ObjectType } from '@nestjs/graphql'
import { EnhancedAsset } from './enhancedAsset.model'

@ObjectType()
export class EnhancedAssetSearchResult {
  @Field(() => [EnhancedAsset])
  items!: EnhancedAsset[]

  @Field()
  total!: number
}
