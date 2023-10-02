import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IServiceWebPage } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'
import { safelyMapSliceUnion, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class ServiceWebPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => Organization, { nullable: true })
  organization?: Organization | null

  @CacheField(() => [SliceUnion])
  slices?: Array<typeof SliceUnion | null>
}

export const mapServiceWebPage = ({
  sys,
  fields,
}: IServiceWebPage): ServiceWebPage => ({
  id: sys.id,
  title: fields.title ?? '',
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
})
