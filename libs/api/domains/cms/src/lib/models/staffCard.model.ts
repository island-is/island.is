import { Field, ObjectType } from '@nestjs/graphql'

import { IStaffCard } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class StaffCard {
  @Field()
  name: string

  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  logo?: Image
}

export const mapStaffCard = ({ fields }: IStaffCard): StaffCard => ({
  name: fields.name ?? '',
  intro: fields.intro ?? '',
  email: fields.email ?? '',
  phone: fields.phone ?? '',
  logo: fields.logo ? mapImage(fields.logo) : null,
})
