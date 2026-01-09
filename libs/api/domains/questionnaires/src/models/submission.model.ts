import { createUnionType, Field, ObjectType } from '@nestjs/graphql'

@ObjectType('QuestionnaireSubmissionValues')
export class QuestionnaireSubmissionValues {
  @Field()
  valueId!: string

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  answer?: string
}

@ObjectType('QuestionnaireSubmissionBooleanAnswer')
export class QuestionnaireSubmissionBooleanAnswer {
  @Field()
  valueId!: string

  @Field()
  label!: string

  @Field()
  answer!: boolean
}

@ObjectType('QuestionnaireSubmissionStringAnswer')
export class QuestionnaireSubmissionStringAnswer {
  @Field()
  valueId!: string

  @Field()
  label!: string

  @Field()
  answer!: string
}

export const QuestionnaireSubmissionAnswer = createUnionType({
  name: 'QuestionnaireSubmissionAnswer',
  types: () => [
    QuestionnaireSubmissionValues,
    QuestionnaireSubmissionBooleanAnswer,
    QuestionnaireSubmissionStringAnswer,
  ],
  resolveType(value) {
    if (value && typeof value === 'object') {
      if ('valueId' in value) {
        return [QuestionnaireSubmissionValues]
      }
      if ('answer' in value && typeof value.answer === 'boolean') {
        return QuestionnaireSubmissionBooleanAnswer
      }
      if ('answer' in value && typeof value.answer === 'string') {
        return QuestionnaireSubmissionStringAnswer
      }
    }
    return null
  },
})

@ObjectType('QuestionnaireSubmission')
export class QuestionnaireSubmission {
  @Field()
  questionId!: string

  @Field({ nullable: true })
  label?: string

  @Field(() => QuestionnaireSubmissionAnswer, {
    nullable: true,
  })
  answer?: typeof QuestionnaireSubmissionAnswer
}
