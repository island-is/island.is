import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Asset } from 'contentful'
import { IEnhancedAsset } from '../generated/contentfulTypes'
import { GenericTag, mapGenericTag } from './genericTag.model'

@ObjectType()
export class EnhancedAsset {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  file!: Asset

  @Field(() => [GenericTag])
  genericTags!: GenericTag[]
}

export const mapEnhancedAsset = ({
  sys,
  fields,
}: IEnhancedAsset): EnhancedAsset => ({
  id: sys.id,
  title: fields.title ?? '',
  file: fields.file ?? '',
  genericTags: fields.genericTags ? fields.genericTags.map(mapGenericTag) : [],
})
