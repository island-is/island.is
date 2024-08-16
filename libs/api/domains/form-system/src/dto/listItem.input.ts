import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";


@InputType('FormSystemListItemInput')
export class ListItemInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  label?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}
