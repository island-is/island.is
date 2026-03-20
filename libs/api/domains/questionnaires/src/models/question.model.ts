import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum AnswerOptionType {
  text = 'text',
  textarea = 'textarea',
  radio = 'radio',
  checkbox = 'checkbox',
  thermometer = 'thermometer',
  number = 'number',
  scale = 'scale',
  label = 'label',
  slider = 'slider',
  date = 'date',
  datetime = 'datetime',
  table = 'table',
}

registerEnumType(AnswerOptionType, {
  name: 'QuestionnaireAnswerOptionType',
  description: 'Type of answer option',
})

export enum VisibilityOperator {
  equals = 'equals',
  contains = 'contains',
  exists = 'exists',
  isEmpty = 'isEmpty',
  greaterThan = 'greaterThan',
  greaterThanOrEqual = 'greaterThanOrEqual',
  lessThan = 'lessThan',
  lessThanOrEqual = 'lessThanOrEqual',
}

registerEnumType(VisibilityOperator, {
  name: 'QuestionnaireVisibilityOperator',
  description: 'Operator for visibility conditions',
})

@ObjectType('QuestionnaireVisibilityCondition')
export class VisibilityCondition {
  @Field()
  questionId!: string

  @Field(() => VisibilityOperator)
  operator!: VisibilityOperator

  @Field(() => [String], { nullable: true })
  expectedValues?: string[]

  @Field({ defaultValue: true })
  showWhenMatched!: boolean
}

// Answer option value type

@ObjectType('QuestionnaireOptionsLabelValue')
export class LabelValue {
  @Field()
  id!: string

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string
}

@ObjectType('QuestionnaireTableColumn')
export class TableColumn {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field()
  type!: string

  @Field(() => Boolean, { nullable: true })
  required?: boolean

  @Field(() => Boolean, { nullable: true })
  multiline?: boolean

  @Field(() => Number, { nullable: true })
  maxLength?: number
}

@ObjectType('QuestionnaireAnswerOption')
export class AnswerOption {
  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  originalId?: string

  @Field(() => AnswerOptionType)
  type!: AnswerOptionType

  @Field({ nullable: true })
  placeholder?: string

  @Field({ nullable: true })
  maxLength?: string

  @Field({ nullable: true })
  min?: string

  @Field({ nullable: true })
  max?: string

  @Field({ nullable: true })
  maxLabel?: string

  @Field({ nullable: true })
  minLabel?: string

  @Field(() => [LabelValue], { nullable: true })
  options?: LabelValue[]

  @Field({ nullable: true })
  formula?: string

  @Field(() => Boolean, { nullable: true })
  decimal?: boolean

  @Field(() => Number, { nullable: true })
  numRows?: number

  @Field(() => Number, { nullable: true })
  maxRows?: number

  @Field(() => [TableColumn], { nullable: true })
  columns?: TableColumn[]
}

@ObjectType('QuestionnaireQuestion')
export class Question {
  @Field()
  id!: string

  @Field({ nullable: true })
  originalId?: string

  @Field()
  label!: string

  @Field({ nullable: true })
  htmlLabel?: string

  @Field({ nullable: true })
  sublabel?: string

  @Field(() => AnswerOption)
  answerOptions!: AnswerOption

  @Field(() => [VisibilityCondition], { nullable: true })
  visibilityConditions?: VisibilityCondition[]

  @Field(() => [String], { nullable: true })
  dependsOn?: string[]

  @Field(() => Boolean, { nullable: true })
  required?: boolean
}
