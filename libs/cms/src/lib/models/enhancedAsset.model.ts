import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IEnhancedAsset } from '../generated/contentfulTypes'
import { Asset, mapAsset } from './asset.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { mapOrganization, Organization } from './organization.model'

@ObjectType()
export class EnhancedAsset {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => Asset, { nullable: true })
  file!: Asset | null

  @CacheField(() => [GenericTag])
  genericTags!: GenericTag[]

  @Field(() => String, { nullable: true })
  releaseDate!: string | null

  @CacheField(() => Organization)
  organization!: Organization | null

  @Field()
  description?: string
}

export const mapEnhancedAsset = ({
  sys,
  fields,
}: IEnhancedAsset): EnhancedAsset => ({
  id: sys.id,
  title: fields.title ?? '',
  file: fields.file ? mapAsset(fields.file) : null,
  genericTags: fields.genericTags ? fields.genericTags.map(mapGenericTag) : [],
  releaseDate: fields.releaseDate ?? null,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  description: fields.description ?? '',
})
