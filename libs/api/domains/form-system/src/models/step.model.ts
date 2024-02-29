import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";
import { Group } from "./group.model";

@ObjectType('FormSystemStep')
export class Step {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  guid?: string

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType

  @Field(() => Boolean, { nullable: true })
  callRulest?: boolean

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => [Group], { nullable: true })
  groups?: Group[]
}

@ObjectType('FormSystemStepCreation')
export class CreateStep {
  @Field(() => Int, { nullable: true })
  formId?: number

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}

@ObjectType('FormSystemStepUpdate')
export class UpdateStep {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType;

  @Field(() => String, { nullable: true })
  type?: string | null;

  @Field(() => Number, { nullable: true })
  displayOrder?: number;

  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType;

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean;
}
