import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  ApplicationListAdminResponseDtoStatusEnum,
  ApplicationListAdminResponseDtoTypeIdEnum,
} from '../../gen/fetch'

import {
  ApplicationResponseDtoStatusEnum,
  ApplicationResponseDtoTypeIdEnum,
} from '../../gen/fetch'
import { FormItemDtoTypeEnum } from '../../gen/fetch/models/FormItemDto'
import { FieldDtoTypeEnum } from '../../gen/fetch/models/FieldDto'

registerEnumType(ApplicationResponseDtoTypeIdEnum, {
  name: 'ApplicationResponseDtoTypeIdEnum',
})

registerEnumType(ApplicationResponseDtoStatusEnum, {
  name: 'ApplicationResponseDtoStatusEnum',
})

registerEnumType(ApplicationListAdminResponseDtoTypeIdEnum, {
  name: 'ApplicationListAdminResponseDtoTypeIdEnum',
})

registerEnumType(ApplicationListAdminResponseDtoStatusEnum, {
  name: 'ApplicationListAdminResponseDtoStatusEnum',
})

registerEnumType(FormItemDtoTypeEnum, {
  name: 'FormItemDtoTypeEnum',
})

registerEnumType(FieldDtoTypeEnum, {
  name: 'FieldDtoTypeEnum',
})

@ObjectType()
class ActionCardTag {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  variant?: string
}

@ObjectType()
class PendingAction {
  @Field(() => String, { nullable: true })
  displayStatus?: string

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  content?: string
}

@ObjectType()
export class ApplicationHistory {
  @Field(() => Date)
  date!: Date

  @Field(() => String, { nullable: true })
  log?: string
}

@ObjectType()
class ActionCardMetaData {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => ActionCardTag, { nullable: true })
  tag?: ActionCardTag

  @Field(() => Boolean, { nullable: true })
  deleteButton?: boolean

  @Field(() => PendingAction, { nullable: true })
  pendingAction?: PendingAction

  @Field(() => [ApplicationHistory], { nullable: true })
  history?: ApplicationHistory[]

  @Field(() => Number, { nullable: true })
  draftFinishedSteps?: number

  @Field(() => Number, { nullable: true })
  draftTotalSteps?: number
}

@ObjectType()
export class ApplicationDataProviderItem {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  action?: string

  @Field(() => String, { nullable: true })
  order?: number

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  subTitle?: string

  @Field(() => String, { nullable: true })
  pageTitle?: string

  @Field(() => String, { nullable: true })
  source?: string
}

@ObjectType()
export class ApplicationFormField {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  isPartOfRepeater?: boolean

  @Field(() => String, { nullable: true })
  type?: FieldDtoTypeEnum

  @Field(() => String, { nullable: true })
  component?: string

  @Field(() => String, { nullable: true })
  disabled?: boolean

  @Field(() => String, { nullable: true })
  width?: string

  @Field(() => String, { nullable: true })
  colSpan?: string

  @Field(() => String, { nullable: true })
  defaultValue?: string

  @Field(() => Boolean, { nullable: true })
  doesNotRequireAnswer?: boolean

  @Field(() => graphqlTypeJson, { nullable: true })
  specifics?: object
}

@ObjectType()
export class FormItem {
  @Field(() => String, { nullable: true })
  condition?: object

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormItemDtoTypeEnum, { nullable: true })
  type?: FormItemDtoTypeEnum

  @Field(() => Boolean, { nullable: true })
  isPartOfRepeater?: boolean

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  space?: string

  @Field(() => [FormItem], { nullable: true })
  children?: FormItem[]

  @Field(() => [ApplicationFormField], { nullable: true })
  fields?: ApplicationFormField[]

  @Field(() => String, { nullable: true })
  draftPageNumber?: number

  @Field(() => [ApplicationDataProviderItem], { nullable: true })
  dataProviders?: ApplicationDataProviderItem[]
}

@ObjectType()
export class ApplicationForm {
  @Field(() => [FormItem], { nullable: true })
  children?: FormItem[]

  @Field(() => String, { nullable: true })
  icon?: string

  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  logo?: string

  @Field(() => String, { nullable: true })
  mode?: string

  @Field(() => String, { nullable: true })
  renderLastScreenBackButton?: boolean

  @Field(() => String, { nullable: true })
  renderLastScreenButton?: boolean

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  type!: string
}

@ObjectType()
export class Application {
  @Field(() => ID)
  id!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => String)
  applicant!: string

  @Field(() => [String])
  assignees!: string[]

  @Field(() => [String])
  applicantActors!: string[]

  @Field(() => String)
  state!: string

  @Field(() => ActionCardMetaData, { nullable: true })
  actionCard?: ActionCardMetaData

  @Field(() => ApplicationResponseDtoTypeIdEnum)
  typeId!: ApplicationResponseDtoTypeIdEnum

  @Field(() => graphqlTypeJson)
  answers!: object

  @Field(() => graphqlTypeJson)
  externalData!: object

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  institution?: string

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => ApplicationResponseDtoStatusEnum)
  status!: ApplicationResponseDtoStatusEnum

  @Field(() => ApplicationForm)
  form!: ApplicationForm
}

@ObjectType()
export class ApplicationAdmin {
  @Field(() => ID)
  id!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => String)
  applicant!: string

  @Field(() => [String])
  assignees!: string[]

  @Field(() => [String])
  applicantActors!: string[]

  @Field(() => String)
  state!: string

  @Field(() => ActionCardMetaData, { nullable: true })
  actionCard?: ActionCardMetaData

  @Field(() => ApplicationListAdminResponseDtoTypeIdEnum)
  typeId!: ApplicationListAdminResponseDtoTypeIdEnum

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  institution?: string

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => ApplicationListAdminResponseDtoStatusEnum)
  status!: ApplicationListAdminResponseDtoStatusEnum

  @Field(() => String, { nullable: true })
  applicantName?: string

  @Field(() => String, { nullable: true })
  paymentStatus?: string
}

@ObjectType()
export class ApplicationPayment {
  @Field()
  fulfilled!: boolean

  @Field()
  paymentUrl!: string
}
