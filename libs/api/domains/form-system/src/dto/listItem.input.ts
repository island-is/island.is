import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageTypeInput } from "./languageType.input";

@InputType('FormSystemCreateListItemInput')
export class CreateListItemInput {
  @Field(() => String, { nullable: true })
  fieldId?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemDeleteListItemInput')
export class DeleteListItemInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateListItemInput')
export class UpdateListItemInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  label?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@InputType('FormSystemListItemDisplayOrderInput')
export class ListItemDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateListItemsDisplayOrderInput')
export class UpdateListItemsDisplayOrderInput {
  @Field(() => [ListItemDisplayOrderInput], { nullable: 'itemsAndList' })
  listItemsDisplayOrderDto?: ListItemDisplayOrderInput[]
}

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
