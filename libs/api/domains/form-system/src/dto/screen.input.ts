import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";
import { FieldInput } from "./field.input";

@InputType('FormSystemScreenInput')
export class ScreenInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  sectionId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Int, { nullable: true })
  multiSet?: number

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean

  @Field(() => [FieldInput], { nullable: true })
  fields?: FieldInput[]
}
