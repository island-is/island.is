import { Field, InputType, ID } from '@nestjs/graphql'
import { AnswerOptionType } from '../../models/question.model'
import { QuestionnairesOrganizationEnum } from '../../models/questionnaires.model'

@InputType()
export class QuestionnaireEntryInput {
  @Field()
  entryID!: string

  @Field(() => [String])
  values!: string[]

  @Field(() => AnswerOptionType)
  type!: AnswerOptionType
}

@InputType()
export class QuestionnaireInput {
  @Field(() => ID)
  id!: string

  @Field(() => QuestionnairesOrganizationEnum)
  organization!: QuestionnairesOrganizationEnum

  @Field()
  formId!: string

  @Field(() => [QuestionnaireEntryInput])
  entries!: QuestionnaireEntryInput[]
}

@InputType()
export class GetQuestionnaireInput {
  @Field(() => ID)
  id!: string

  @Field(() => QuestionnairesOrganizationEnum, { nullable: true })
  organization?: QuestionnairesOrganizationEnum

  @Field({ nullable: true })
  formId?: string

  @Field(() => Boolean, { nullable: true })
  includeQuestions?: boolean
}

@InputType()
export class QuestionnaireAnsweredInput {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  formId?: string

  @Field()
  submissionId!: string

  @Field()
  organization!: string
}
