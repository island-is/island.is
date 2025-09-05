import {
  Field,
  ObjectType,
  createUnionType,
  registerEnumType,
} from '@nestjs/graphql'

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
  text = 'text',
  radio = 'radio',
  checkbox = 'checkbox',
  select = 'select',
  thermometer = 'thermometer',
  number = 'number',
}

registerEnumType(AnswerOptionType, {
  name: 'QuestionnaireAnswerOptionType',
  description: 'Type of answer option',
})

@ObjectType('HealthQuestionnaireAnswerBase')
abstract class HealthQuestionnaireAnswerBase {
  @Field()
  id!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  sublabel?: string

  @Field(() => QuestionDisplayType)
  display!: QuestionDisplayType
}

// Thermometer-specific answer type
@ObjectType('HealthQuestionnaireAnswerThermometer')
export class HealthQuestionnaireAnswerThermometer extends HealthQuestionnaireAnswerBase {
  @Field()
  maxLabel!: string

  @Field()
  minLabel!: string
}

// Text input answer type
@ObjectType('HealthQuestionnaireAnswerText')
export class HealthQuestionnaireAnswerText extends HealthQuestionnaireAnswerBase {
  @Field({ nullable: true })
  placeholder?: string

  @Field({ nullable: true })
  maxLength?: number
}

// Number input answer type
@ObjectType('HealthQuestionnaireAnswerNumber')
export class HealthQuestionnaireAnswerNumber extends HealthQuestionnaireAnswerBase {
  @Field({ nullable: true })
  placeholder?: string

  @Field({ nullable: true })
  min?: number

  @Field({ nullable: true })
  max?: number
}

// Radio/Select answer type
@ObjectType('HealthQuestionnaireAnswerRadio')
export class HealthQuestionnaireAnswerRadio extends HealthQuestionnaireAnswerBase {
  @Field(() => [String])
  options!: string[]
}

// Multicheck answer type
@ObjectType('HealthQuestionnaireAnswerCheckbox')
export class HealthQuestionnaireAnswerCheckbox extends HealthQuestionnaireAnswerBase {
  @Field(() => [String])
  options!: string[]
}

// Union type for health questionnaire answers
const HealthQuestionnaireAnswerUnion = createUnionType({
  name: 'HealthQuestionnaireAnswer',
  types: () =>
    [
      HealthQuestionnaireAnswerThermometer,
      HealthQuestionnaireAnswerText,
      HealthQuestionnaireAnswerRadio,
      HealthQuestionnaireAnswerCheckbox,
      HealthQuestionnaireAnswerNumber,
    ] as const,
  resolveType: (value) => {
    switch (value.__typename) {
      case 'HealthQuestionnaireAnswerThermometer':
        return HealthQuestionnaireAnswerThermometer
      case 'HealthQuestionnaireAnswerText':
        return HealthQuestionnaireAnswerText
      case 'HealthQuestionnaireAnswerRadio':
        return HealthQuestionnaireAnswerRadio
      case 'HealthQuestionnaireAnswerNumber':
        return HealthQuestionnaireAnswerNumber
      case 'HealthQuestionnaireAnswerCheckbox':
        return HealthQuestionnaireAnswerCheckbox
      default:
        return null
    }
  },
})

// Answer option value type
@ObjectType('AnswerOptionValue')
export class AnswerOptionValue {
  @Field(() => [HealthQuestionnaireAnswerUnion], { nullable: true })
  extraQuestions?: Array<typeof HealthQuestionnaireAnswerUnion>
}

// Answer option type
@ObjectType('AnswerOption')
export class AnswerOption {
  @Field()
  id!: string

  @Field(() => AnswerOptionValue, { nullable: true })
  value?: AnswerOptionValue

  @Field()
  label!: string

  @Field(() => AnswerOptionType)
  type!: AnswerOptionType
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

  @Field(() => [AnswerOption], { nullable: true })
  answerOptions?: AnswerOption[]
}

// Export the union type for use in resolvers
export { HealthQuestionnaireAnswerUnion }
