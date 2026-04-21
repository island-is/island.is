import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { Question, VisibilityCondition } from './question.model'
import { QuestionnairesBaseItem } from './questionnaires.model'

@ObjectType('QuestionnaireAnswerValue')
export class QuestionnaireAnswerValue {
  @Field({ nullable: true })
  label?: string

  @Field()
  value!: string
}

@ObjectType('QuestionnaireDraftAnswer')
export class QuestionnaireDraftAnswer {
  @Field()
  questionId!: string

  @Field(() => [QuestionnaireAnswerValue])
  answers!: QuestionnaireAnswerValue[]

  @Field()
  type!: string
}

@ObjectType('QuestionnaireSubmissionDetail')
export class QuestionnaireSubmissionDetail {
  @Field()
  id!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date

  @Field(() => Boolean, { nullable: true })
  isDraft?: boolean

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date
}

@ObjectType('QuestionnaireSection')
export class QuestionnaireSection {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [Question], { nullable: true })
  questions?: Question[]

  @Field(() => [VisibilityCondition], { nullable: true })
  visibilityConditions?: VisibilityCondition[]

  @Field(() => [String], { nullable: true })
  dependsOn?: string[]
}

@ObjectType('QuestionnaireDetail')
export class Questionnaire {
  @Field(() => QuestionnairesBaseItem)
  baseInformation!: QuestionnairesBaseItem

  @Field(() => String, { nullable: true })
  sender?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  expirationDate?: Date

  @Field(() => Boolean, { nullable: true })
  canSubmit?: boolean

  @Field(() => [QuestionnaireSubmissionDetail], { nullable: true })
  submissions?: QuestionnaireSubmissionDetail[]

  @Field(() => [QuestionnaireSection], { nullable: true })
  sections?: QuestionnaireSection[]

  @Field(() => [QuestionnaireDraftAnswer], { nullable: true })
  draftAnswers?: QuestionnaireDraftAnswer[]
}
