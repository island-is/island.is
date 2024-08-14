import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model";

@InputType('FormSystemScreenInput')
export class ScreenInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  sectionId?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Int, { nullable: true })
  multiSet?: number

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean
}
