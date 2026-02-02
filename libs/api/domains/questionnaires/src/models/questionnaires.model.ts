import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum QuestionnairesOrganizationEnum {
  LSH = 'LSH',
  EL = 'EL',
}
registerEnumType(QuestionnairesOrganizationEnum, {
  name: 'QuestionnaireQuestionnairesOrganizationEnum',
})

export enum QuestionnairesStatusEnum {
  answered = 'answered',
  notAnswered = 'notAnswered',
  expired = 'expired',
  draft = 'draft',
}
registerEnumType(QuestionnairesStatusEnum, {
  name: 'QuestionnaireQuestionnairesStatusEnum',
})

@ObjectType('QuestionnairesBaseItem')
export class QuestionnairesBaseItem {
  @Field()
  id!: string

  @Field()
  title!: string

  @Field()
  sentDate!: string

  @Field({ nullable: true })
  formId?: string

  @Field(() => QuestionnairesStatusEnum, { nullable: true })
  status?: QuestionnairesStatusEnum

  @Field({ nullable: true })
  description?: string

  @Field(() => Date, { nullable: true })
  lastSubmitted?: Date

  @Field(() => String, { nullable: true })
  lastSubmissionId?: string

  @Field(() => QuestionnairesOrganizationEnum, { nullable: true })
  organization?: QuestionnairesOrganizationEnum

  @Field(() => String, { nullable: true })
  department?: string
}

@ObjectType('QuestionnairesList')
export class QuestionnairesList {
  @Field(() => [QuestionnairesBaseItem], { nullable: true })
  questionnaires?: Array<QuestionnairesBaseItem>
}
