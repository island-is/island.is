import { Field, ObjectType } from '@nestjs/graphql'
import { OrganizationTag } from './organizationTag.model'

@ObjectType()
export class OrganizationTags {
  @Field(() => [OrganizationTag])
  items?: OrganizationTag[]
}
