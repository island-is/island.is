import { Field, Int, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model";
import { ApplicationFieldInput } from "./applicationField.input";

@ObjectType('FormSystemApplicationScreenInput')
export class ApplicationScreenInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  sectionId?: string;

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType;

  @Field(() => Int, { nullable: true })
  displayOrder?: number;

  @Field(() => Int, { nullable: true })
  multiset?: number;

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean;

  @Field(() => [ApplicationFieldInput], { nullable: true })
  fields?: ApplicationFieldInput[];
}
