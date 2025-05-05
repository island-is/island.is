import { Field, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemCreateListItemDtoInput')
export class CreateListItemDtoInput {
  @Field(() => String, { nullable: true })
  fieldId?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemCreateListItemInput')
export class CreateListItemInput {
  @Field(() => CreateListItemDtoInput, { nullable: true })
  createListItemDto?: CreateListItemDtoInput
}

@InputType('FormSystemDeleteListItemInput')
export class DeleteListItemInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateListItemDtoInput')
export class UpdateListItemDto {
  @Field(() => LanguageTypeInput, { nullable: true })
  label?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@InputType('FormSystemUpdateListItemInput')
export class UpdateListItemInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => UpdateListItemDto, { nullable: true })
  updateListItemDto?: UpdateListItemDto
}

@InputType('FormSystemListItemDisplayOrderInput')
export class ListItemDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateListItemsDisplayOrderDtoInput')
export class UpdateListItemsDisplayOrderDtoInput {
  @Field(() => [ListItemDisplayOrderInput], { nullable: 'itemsAndList' })
  listItemsDisplayOrderDto?: ListItemDisplayOrderInput[]
}

@InputType('FormSystemUpdateListItemsDisplayOrderInput')
export class UpdateListItemDisplayOrderInput {
  @Field(() => UpdateListItemsDisplayOrderDtoInput, { nullable: true })
  updateListItemsDisplayOrderDto?: UpdateListItemsDisplayOrderDtoInput
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
