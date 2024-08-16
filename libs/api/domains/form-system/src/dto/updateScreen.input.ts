import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";

@InputType('FormSystemUpdateScreenInput')
export class UpdateScreenInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  multiSet?: number

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean
}
