import { Field, ObjectType } from '@nestjs/graphql'
import { GetPublishedMaterialObject } from '../dto/getPublishedMaterial.input'

import { EnhancedAsset } from './enhancedAsset.model'

@ObjectType()
export class EnhancedAssetSearchResult {
  @Field(() => [EnhancedAsset])
  items!: EnhancedAsset[]

  @Field()
  total!: number

  @Field(() => GetPublishedMaterialObject)
  input!: GetPublishedMaterialObject
}
