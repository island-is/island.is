import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum QuestionDisplayType {
  required = 'required',
  optional = 'optional',
  hidden = 'hidden',
}

registerEnumType(QuestionDisplayType, {
  name: 'QuestionnaireQuestionDisplayType',
  description: 'Display type for questionnaire questions',
})

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
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string
}

@ObjectType('QuestionnaireAnswerOptionValue')
export class AnswerOptionValue {
  @Field(() => [String], { nullable: true })
  extraQuestions?: string[]
}

// Answer option type - flattened to include answer type properties directly
@ObjectType('QuestionnaireAnswerOption')
export class AnswerOption {
  @Field()
  id!: string

  @Field(() => AnswerOptionValue, { nullable: true })
  value?: AnswerOptionValue

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  sublabel?: string

  // Common fields from HealthQuestionnaireAnswerBase
  @Field(() => AnswerOptionType)
  type!: AnswerOptionType

  @Field(() => QuestionDisplayType)
  display!: QuestionDisplayType

  // Text input specific fields
  @Field({ nullable: true })
  placeholder?: string

  @Field({ nullable: true })
  maxLength?: number

  // Number input specific fields
  @Field({ nullable: true })
  min?: string

  @Field({ nullable: true })
  max?: string

  // Thermometer/Scale specific fields
  @Field({ nullable: true })
  maxLabel?: string

  @Field({ nullable: true })
  minLabel?: string

  // Radio/Checkbox specific fields
  @Field(() => [LabelValue], { nullable: true })
  options?: LabelValue[]
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

  @Field(() => QuestionDisplayType)
  display!: QuestionDisplayType

  @Field(() => AnswerOption)
  answerOptions!: AnswerOption

  @Field(() => [VisibilityCondition], { nullable: true })
  visibilityConditions?: VisibilityCondition[]

  @Field(() => [String], { nullable: true })
  dependsOn?: string[]
}
