import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { ISliceDropdown } from '../generated/contentfulTypes'
import { mapOneColumnText, OneColumnText } from './oneColumnText.model'

@ObjectType()
export class SliceDropdown {
  @Field(() => ID)
  id!: string

  @Field(() => String, { nullable: true })
  dropdownLabel?: string

  @CacheField(() => [OneColumnText])
  slices!: OneColumnText[]
}

export const mapSliceDropdown = ({
  sys,
  fields,
}: ISliceDropdown): SystemMetadata<SliceDropdown> => ({
  typename: 'SliceDropdown',
  id: sys.id,
  dropdownLabel: fields.dropdownLabel,
  slices: fields?.slices?.map(mapOneColumnText) ?? [],
})
