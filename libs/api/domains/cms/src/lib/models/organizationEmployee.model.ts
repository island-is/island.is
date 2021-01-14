import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOrganizationEmployee } from '../generated/contentfulTypes'

@ObjectType()
export class OrganizationEmployee {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  representative?: boolean
}

export const mapOrganizationEmployee = ({
  fields,
  sys,
}: IOrganizationEmployee): OrganizationEmployee => ({
  id: sys.id,
  name: fields.name ?? '',
  title: fields.title ?? '',
  email: fields.email ?? '',
  phoneNumber: fields.phoneNumber ?? '',
  representative: fields.representative ?? null,
})
