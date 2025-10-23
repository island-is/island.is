import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum AnswerOptionType {
  text = 'HealthQuestionnaireAnswerText',
  textarea = 'HealthQuestionnaireAnswerTextarea',
  radio = 'HealthQuestionnaireAnswerRadio',
  checkbox = 'HealthQuestionnaireAnswerCheckbox',
  thermometer = 'HealthQuestionnaireAnswerThermometer',
  number = 'HealthQuestionnaireAnswerNumber',
  scale = 'HealthQuestionnaireAnswerScale',
  label = 'HealthQuestionnaireAnswerLabel',
  slider = 'HealthQuestionnaireAnswerSlider',
  date = 'HealthQuestionnaireAnswerDate',
  datetime = 'HealthQuestionnaireAnswerDateTime',
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

@ObjectType('QuestionnaireAnswerOption')
export class AnswerOption {
  @Field({ nullable: true })
  value?: string

  @Field(() => AnswerOptionType)
  type!: AnswerOptionType

  @Field({ nullable: true })
  placeholder?: string

  @Field({ nullable: true })
  maxLength?: number

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
}

// Main question type
@ObjectType('QuestionnaireQuestion')
export class Question {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  sublabel?: string

  @Field(() => AnswerOption)
  answerOptions!: AnswerOption

  @Field(() => [VisibilityCondition], { nullable: true })
  visibilityConditions?: VisibilityCondition[]

  @Field(() => [String], { nullable: true })
  dependsOn?: string[]
}
