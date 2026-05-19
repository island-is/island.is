import { InputType, Field } from '@nestjs/graphql'

@InputType('FormSystemOrganizationZendeskInstanceInput')
export class OrganizationZendeskInstanceInput {
  @Field(() => String, { nullable: true })
  zendeskInstance?: string

  @Field(() => String, { nullable: true })
  zendeskBrandId?: string

  @Field(() => String, { nullable: true })
  organizationId?: string
}
