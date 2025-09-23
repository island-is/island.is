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
  radio = 'HealthQuestionnaireAnswerRadio',
  checkbox = 'HealthQuestionnaireAnswerCheckbox',
  thermometer = 'HealthQuestionnaireAnswerThermometer',
  number = 'HealthQuestionnaireAnswerNumber',
  scale = 'HealthQuestionnaireAnswerScale',
  label = 'HealthQuestionnaireAnswerLabel',
}

registerEnumType(AnswerOptionType, {
  name: 'QuestionnaireAnswerOptionType',
  description: 'Type of answer option',
})

// Answer option value type
@ObjectType('AnswerOptionValue')
export class AnswerOptionValue {
  @Field(() => [String], { nullable: true })
  extraQuestions?: string[]
}

// Answer option type - flattened to include answer type properties directly
@ObjectType('AnswerOption')
export class AnswerOption {
  @Field()
  id!: string

  @Field(() => AnswerOptionValue, { nullable: true })
  value?: AnswerOptionValue

  @Field({ nullable: true })
  label?: string

  // Common fields from HealthQuestionnaireAnswerBase
  @Field(() => AnswerOptionType)
  type!: AnswerOptionType

  @Field({ nullable: true })
  sublabel?: string

  @Field(() => QuestionDisplayType)
  display!: QuestionDisplayType

  // Text input specific fields
  @Field({ nullable: true })
  placeholder?: string

  @Field({ nullable: true })
  maxLength?: number

  // Number input specific fields
  @Field({ nullable: true })
  min?: number

  @Field({ nullable: true })
  max?: number

  // Thermometer/Scale specific fields
  @Field({ nullable: true })
  maxLabel?: string

  @Field({ nullable: true })
  minLabel?: string

  @Field({ nullable: true })
  minValue?: number

  @Field({ nullable: true })
  maxValue?: number

  // Radio/Checkbox specific fields
  @Field(() => [String], { nullable: true })
  options?: string[]
}

// Main question type
@ObjectType('Question')
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

  @Field(() => [String], { nullable: true })
  dependsOn?: string[]

  @Field({ nullable: true })
  visibilityCondition?: string
}
