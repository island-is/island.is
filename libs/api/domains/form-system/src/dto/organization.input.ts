import { Field, InputType } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";
import { FormInput } from "./form.input";

@InputType('FormSystemOrganizationInput')
export class OrganizationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => [FormInput], { nullable: true })
  forms?: FormInput[]
}
