import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISliceDropdown } from '../generated/contentfulTypes'
import { SystemMetadata } from 'api-cms-domain'
import { mapOneColumnText, OneColumnText } from './oneColumnText.model'

@ObjectType()
export class SliceDropdown {
  @Field(() => ID)
  id!: string

  @Field(() => String, { nullable: true })
  dropdownLabel?: string

  @Field(() => [OneColumnText])
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
