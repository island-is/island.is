import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IOrganizationTag } from '../generated/contentfulTypes'

@ObjectType()
export class OrganizationTag {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string
}

export const mapOrganizationTag = ({
  fields,
  sys,
}: IOrganizationTag): OrganizationTag => ({
  id: sys.id,
  title: fields.title ?? '',
})
