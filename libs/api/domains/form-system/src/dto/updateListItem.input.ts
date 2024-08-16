import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";

@InputType('FormSystemListItemInput')
export class ListItemInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  label?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}
