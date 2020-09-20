import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IContactUs } from '../generated/contentfulTypes'

@ObjectType()
export class ContactUs {
  @Field(() => ID)
  id: string

  @Field()
  title: string
}

export const mapContactUs = ({ fields, sys }: IContactUs): ContactUs => ({
  id: sys.id,
  title: fields.title ?? '',
})
