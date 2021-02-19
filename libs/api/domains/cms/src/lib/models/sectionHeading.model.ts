import { Field, ObjectType } from '@nestjs/graphql'

import { ISectionHeading } from '../generated/contentfulTypes'

@ObjectType()
export class SectionHeading {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  body?: string
}

export const mapSectionHeading = ({
  fields,
}: ISectionHeading): SectionHeading => ({
  title: fields.title ?? '',
  body: fields.body ?? '',
})
