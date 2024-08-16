import { Field, InputType } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";

@InputType('FormSystemCreateOrganizationInput')
export class CreateOrganizationInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  nationalId?: string
}
