import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganization } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'
import { mapOrganizationPage, OrganizationPage } from './organizationPage.model'
import {
  mapOrganizationOffice,
  OrganizationOffice,
} from './organizationOffice.model'
import {
  mapOrganizationEmployee,
  OrganizationEmployee,
} from './organizationEmployee.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  shortTitle: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  email?: string

  @Field()
  slug: string

  @Field(() => [OrganizationTag])
  tag?: Array<OrganizationTag>

  @Field({ nullable: true })
  logo?: Image

  @Field({ nullable: true })
  internalSite: boolean

  @Field({ nullable: true })
  link?: string

  @Field(() => [OrganizationOffice], { nullable: true })
  offices?: Array<OrganizationOffice>

  @Field(() => [OrganizationEmployee], { nullable: true })
  employees?: Array<OrganizationEmployee>

  @Field(() => OrganizationPage, { nullable: true })
  organizationPage: OrganizationPage

  @Field(() => [Organization], { nullable: true })
  suborganizations?: Array<Organization>
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => ({
  id: sys.id,
  title: fields.title,
  shortTitle: fields.shortTitle ?? '',
  description: fields.description ?? '',
  phoneNumber: fields.phoneNumber ?? '',
  email: fields.email ?? '',
  slug: fields.slug,
  tag: (fields.tag ?? []).map(mapOrganizationTag),
  logo: mapImage(fields.logo),
  internalSite: fields.internalSite ?? null,
  link: fields.link ?? '',
  offices: (fields.offices ?? []).map(mapOrganizationOffice),
  employees: (fields.employees ?? []).map(mapOrganizationEmployee),
  organizationPage: fields.organizationPage
    ? mapOrganizationPage(fields.organizationPage)
    : null,
  suborganizations: (fields.suborganizations ?? []).map(mapOrganization),
})
