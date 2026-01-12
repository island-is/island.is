import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'
import { FormInput } from './form.input'

@InputType('FormSystemOrganizationsResponseInput')
export class OrganizationResponseInput {
  @Field(() => [OrganizationInput], { nullable: 'itemsAndList' })
  organizations?: OrganizationInput[]
}

@InputType('FormSystemGetOrganizationInput')
export class GetOrganizationInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemGetOrganizationAdminInput')
export class GetOrganizationAdminInput {
  @Field(() => String)
  nationalId!: string
}

@InputType('FormSystemCreateOrganizationInput')
export class CreateOrganizationInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  nationalId?: string
}

@InputType('FormSystemOrganizationInput')
export class OrganizationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => [FormInput], { nullable: 'itemsAndList' })
  forms?: FormInput[]
}
