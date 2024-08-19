import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";
import { FieldInput } from "./field.input";

@InputType('FormSystemCreateScreenInput')
export class CreateScreenInput {
  @Field(() => String, { nullable: true })
  sectionId?: string
}

@InputType('FormSystemUpdateScreenInput')
export class UpdateScreenInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  multiSet?: number

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean
}

@InputType('FormSystemDeleteScreenInput')
export class DeleteScreenInput {
  @Field(() => String)
  id!: string
}

@InputType('FormSystemScreenDisplayOrderInput')
export class ScreenDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  sectionId?: string
}

@InputType('FormSystemUpdateScreensDisplayOrderInput')
export class UpdateScreensDisplayOrderInput {
  @Field(() => [ScreenDisplayOrderInput], { nullable: 'itemsAndList' })
  screensDisplayOrderDto?: ScreenDisplayOrderInput[]
}

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

  @Field(() => [FieldInput], { nullable: 'itemsAndList' })
  fields?: FieldInput[]
}
