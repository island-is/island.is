import { Field, ObjectType, ID, Int } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
export class ApplicationTranslationGql {
  @Field(() => ID)
  id!: string

  @Field()
  namespace!: string

  @Field()
  messageKey!: string

  @Field()
  valueIs!: string

  @Field(() => String, { nullable: true })
  valueEn?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null

  @Field(() => String, { nullable: true })
  draftValueIs?: string | null

  @Field(() => String, { nullable: true })
  draftValueEn?: string | null

  @Field()
  isReviewed!: boolean

  @Field(() => String, { nullable: true })
  translatedBy?: string | null

  @Field(() => String, { nullable: true })
  reviewedBy?: string | null

  @Field()
  created!: string

  @Field()
  modified!: string
}

@ObjectType()
export class ApplicationTranslationStatus {
  @Field()
  namespace!: string

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  translatedEn!: number

  @Field(() => Int)
  untranslatedEn!: number

  @Field(() => Int)
  reviewed!: number
}

@ObjectType()
export class AiTranslationResultGql {
  @Field(() => graphqlTypeJson)
  translations!: Record<string, string>
}

@ObjectType()
export class MessageDescriptorGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  defaultMessage?: string

  @Field(() => String, { nullable: true })
  description?: string
}

@ObjectType()
export class ValidationMessageDescriptorGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  defaultMessage?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field()
  fieldPath!: string
}

@ObjectType()
export class RadioOptionIntrospectionGql {
  @Field()
  value!: string

  @Field(() => String, { nullable: true })
  labelMessageId?: string | null

  @Field(() => String, { nullable: true })
  labelDefaultMessage?: string | null
}

@ObjectType()
export class StaticTableSummaryRowGql {
  @Field(() => MessageDescriptorGql)
  label!: MessageDescriptorGql

  @Field(() => MessageDescriptorGql)
  value!: MessageDescriptorGql
}

@ObjectType()
export class ScreenIntrospectionGql {
  @Field()
  id!: string

  @Field()
  type!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String, { nullable: true })
  pageTitle?: string | null

  @Field(() => String, { nullable: true })
  subTitle?: string | null

  @Field(() => String, { nullable: true })
  subDescription?: string | null

  @Field(() => String, { nullable: true })
  checkboxLabel?: string | null

  @Field(() => String, { nullable: true })
  width?: string | null

  @Field(() => Int, { nullable: true })
  space?: number | null

  @Field(() => graphqlTypeJson, { nullable: true })
  marginTop?: unknown

  @Field(() => graphqlTypeJson, { nullable: true })
  marginBottom?: unknown

  @Field(() => graphqlTypeJson, { nullable: true })
  paddingTop?: unknown

  @Field(() => String, { nullable: true })
  titleVariant?: string | null

  @Field(() => [MessageDescriptorGql])
  messageDescriptors!: MessageDescriptorGql[]

  @Field(() => [RadioOptionIntrospectionGql], { nullable: true })
  radioOptions?: RadioOptionIntrospectionGql[] | null

  @Field(() => Boolean, { nullable: true })
  radioLargeButtons?: boolean | null

  @Field(() => String, { nullable: true })
  radioBackgroundColor?: string | null

  @Field(() => [RadioOptionIntrospectionGql], { nullable: true })
  checkboxOptions?: RadioOptionIntrospectionGql[] | null

  @Field(() => Boolean, { nullable: true })
  checkboxLarge?: boolean | null

  @Field(() => Boolean, { nullable: true })
  checkboxStrong?: boolean | null

  @Field(() => String, { nullable: true })
  checkboxBackgroundColor?: string | null

  @Field(() => Int, { nullable: true })
  checkboxSpacing?: number | null

  @Field(() => [MessageDescriptorGql], { nullable: true })
  tableRepeaterColumnHeaders?: MessageDescriptorGql[] | null

  @Field(() => String, { nullable: true })
  tableRepeaterFormTitle?: string | null

  @Field(() => String, { nullable: true })
  tableRepeaterAddItemButtonText?: string | null

  @Field(() => String, { nullable: true })
  tableRepeaterCancelButtonText?: string | null

  @Field(() => String, { nullable: true })
  tableRepeaterSaveItemButtonText?: string | null

  @Field(() => String, { nullable: true })
  fieldsRepeaterFormTitle?: string | null

  @Field(() => String, { nullable: true })
  fieldsRepeaterAddItemButtonText?: string | null

  @Field(() => String, { nullable: true })
  fieldsRepeaterRemoveItemButtonText?: string | null

  @Field(() => String, { nullable: true })
  nationalIdWithNameCustomNationalIdLabelText?: string | null

  @Field(() => String, { nullable: true })
  nationalIdWithNameCustomNameLabelText?: string | null

  @Field(() => Boolean, { nullable: true })
  nationalIdWithNameShowPhoneField?: boolean | null

  @Field(() => Boolean, { nullable: true })
  nationalIdWithNameShowEmailField?: boolean | null

  @Field(() => String, { nullable: true })
  nationalIdWithNamePhoneLabelText?: string | null

  @Field(() => String, { nullable: true })
  nationalIdWithNameEmailLabelText?: string | null

  @Field(() => [MessageDescriptorGql], { nullable: true })
  staticTableHeaderDescriptors?: MessageDescriptorGql[] | null

  @Field(() => [MessageDescriptorGql], { nullable: true })
  staticTableRowCellDescriptors?: MessageDescriptorGql[] | null

  @Field(() => Int, { nullable: true })
  staticTableColumnCount?: number | null

  @Field(() => Int, { nullable: true })
  staticTableRowCount?: number | null

  @Field(() => Boolean, { nullable: true })
  staticTableHeaderFromFunction?: boolean | null

  @Field(() => Boolean, { nullable: true })
  staticTableRowsFromFunction?: boolean | null

  @Field(() => String, { nullable: true })
  staticTableTitleVariant?: string | null

  @Field(() => [StaticTableSummaryRowGql], { nullable: true })
  staticTableSummary?: StaticTableSummaryRowGql[] | null

  @Field(() => String, { nullable: true })
  alertType?: string | null

  @Field(() => String, { nullable: true })
  alertMessage?: string | null

  @Field(() => [ScreenIntrospectionGql], { nullable: true })
  children?: ScreenIntrospectionGql[]
}

@ObjectType()
export class SubSectionIntrospectionGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => MessageDescriptorGql, { nullable: true })
  titleMessageDescriptor?: MessageDescriptorGql | null

  @Field(() => [ScreenIntrospectionGql])
  screens!: ScreenIntrospectionGql[]
}

@ObjectType()
export class SectionIntrospectionGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => MessageDescriptorGql, { nullable: true })
  titleMessageDescriptor?: MessageDescriptorGql | null

  @Field(() => [SubSectionIntrospectionGql])
  subSections!: SubSectionIntrospectionGql[]

  @Field(() => [ScreenIntrospectionGql])
  screens!: ScreenIntrospectionGql[]
}

@ObjectType()
export class FormIntrospectionGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => String, { nullable: true })
  logoKey?: string | null

  @Field(() => [SectionIntrospectionGql])
  sections!: SectionIntrospectionGql[]
}

@ObjectType()
export class RoleIntrospectionGql {
  @Field()
  roleId!: string

  @Field(() => FormIntrospectionGql, { nullable: true })
  form?: FormIntrospectionGql | null
}

@ObjectType()
export class StateIntrospectionGql {
  @Field()
  stateKey!: string

  @Field()
  stateName!: string

  @Field()
  status!: string

  @Field(() => [RoleIntrospectionGql])
  roles!: RoleIntrospectionGql[]
}

@ObjectType()
export class TemplateIntrospectionGql {
  @Field()
  typeId!: string

  @Field()
  name!: string

  @Field()
  slug!: string

  @Field(() => [String])
  translationNamespaces!: string[]

  @Field(() => [StateIntrospectionGql])
  states!: StateIntrospectionGql[]

  @Field(() => [MessageDescriptorGql])
  allMessageDescriptors!: MessageDescriptorGql[]

  @Field(() => [ValidationMessageDescriptorGql])
  validationMessageDescriptors!: ValidationMessageDescriptorGql[]
}

@ObjectType()
export class TemplateListItemGql {
  @Field()
  typeId!: string

  @Field()
  name!: string

  @Field()
  slug!: string

  @Field(() => [String])
  translationNamespaces!: string[]
}

@ObjectType()
export class TranslationPublishGql {
  @Field(() => ID)
  id!: string

  @Field()
  namespace!: string

  @Field(() => String, { nullable: true })
  publishedBy?: string | null

  @Field()
  publishedAt!: string

  @Field(() => String, { nullable: true })
  note?: string | null
}
