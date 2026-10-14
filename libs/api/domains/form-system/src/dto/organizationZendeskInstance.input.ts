import { InputType, Field } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemOrganizationZendeskInstanceInput')
export class OrganizationZendeskInstanceInput {
  @Field(() => String, { nullable: true })
  zendeskInstance?: string

  @Field(() => String, { nullable: true })
  zendeskBrandId?: string

  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  logo?: string
}
