import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('FormSystemOrganizationZendeskInstance')
export class OrganizationZendeskInstance {
  @Field(() => String, { nullable: true })
  zendeskInstance?: string

  @Field(() => String, { nullable: true })
  zendeskBrandId?: string
}
