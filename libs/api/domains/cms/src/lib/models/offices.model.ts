import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOffices } from '../generated/contentfulTypes'

import {
  OrganizationOffice,
  mapOrganizationOffice,
} from './organizationOffice.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class Offices {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => [OrganizationOffice])
  offices?: Array<OrganizationOffice>
}

export const mapOffices = ({
  sys,
  fields,
}: IOffices): SystemMetadata<Offices> => ({
  typename: 'Offices',
  id: sys.id,
  title: fields.title ?? '',
  offices: (fields.offices ?? []).map(mapOrganizationOffice),
})
