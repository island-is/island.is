import { Field, ObjectType, ID } from '@nestjs/graphql'
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

  @Field(() => Asset, { nullable: true })
  file!: Asset | null

  @Field(() => [GenericTag])
  genericTags!: GenericTag[]

  @Field()
  releaseDate?: string

  @Field(() => Organization)
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
  releaseDate: fields.releaseDate ?? '',
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  description: fields.description ?? '',
})
