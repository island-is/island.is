import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";
import { Input } from "./input.model";

@ObjectType('FormSystemGroup')
export class Group {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  guid?: string

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => [Input], { nullable: true })
  inputs?: Input[]

  @Field(() => Number, { nullable: true })
  stepId?: number

  @Field(() => Number, { nullable: true })
  multiSet?: number

  @Field(() => String, { nullable: true })
  stepGuid?: string
}

@ObjectType('FormSystemGroupCreation')
export class CreateGroup {
  @Field(() => ID, { nullable: true })
  stepId?: number

  @Field(() => Number, { nullable: true })
  displayOrder?: number
}

@ObjectType('FormSystemGroupUpdate')
export class UpdateGroup {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  guid?: string

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Number, { nullable: true })
  multiSet?: number

}

