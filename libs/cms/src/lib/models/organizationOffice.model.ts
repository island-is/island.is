import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOrganizationOffice } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class OrganizationOffice {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  name!: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  openingHours?: string

  @Field(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>
}

export const mapOrganizationOffice = ({
  sys,
  fields,
}: IOrganizationOffice): OrganizationOffice => ({
  id: sys.id,
  name: fields.name ?? '',
  city: fields.city ?? '',
  address: fields.address ?? '',
  email: fields.email ?? '',
  phoneNumber: fields.phoneNumber ?? '',
  openingHours: fields.openingHours ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
})
