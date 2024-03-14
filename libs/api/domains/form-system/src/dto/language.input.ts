import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemGlobalInput')
export class LanguageTypeInput {
  @Field(() => String, { nullable: true })
  is?: string | null

  @Field(() => String, { nullable: true })
  en?: string | null
}
