import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { IOrganization } from '../generated/contentfulTypes'
import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug: string

  @Field(() => [OrganizationTag], { nullable: true })
  @IsOptional()
  tag?: Array<OrganizationTag>

  @Field({ nullable: true })
  link?: string
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => ({
  id: sys.id,
  title: fields?.title ?? '',
  description: fields?.description ?? '',
  slug: fields?.slug ?? '',
  tag: (fields?.tag ?? []).map(mapOrganizationTag),
  link: fields?.link ?? '',
})
