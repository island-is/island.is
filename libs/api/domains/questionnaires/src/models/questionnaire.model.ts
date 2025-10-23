import { Field, ObjectType } from '@nestjs/graphql'
import { Question } from './question.model'
import { QuestionnairesBaseItem } from './questionnaires.model'

@ObjectType('QuestionnaireSubmissionDetail')
export class QuestionnaireSubmissionDetail {
  @Field()
  id!: string

  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @Field(() => Boolean, { nullable: true })
  isDraft?: boolean

  @Field(() => Date, { nullable: true })
  lastUpdated?: Date
}

@ObjectType('QuestionnaireSection')
export class QuestionnaireSection {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [Question], { nullable: true })
  questions?: Question[]
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
}
