import { Field, ObjectType } from '@nestjs/graphql'
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

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Boolean, { nullable: true })
  isDraft?: boolean

  @Field(() => Date, { nullable: true })
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

@ObjectType('Questionnaire')
export class Questionnaire {
  @Field(() => QuestionnairesBaseItem)
  baseInformation!: QuestionnairesBaseItem

  @Field(() => Date, { nullable: true })
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
