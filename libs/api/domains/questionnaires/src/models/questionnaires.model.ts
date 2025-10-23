import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum QuestionnairesStatusEnum {
  answered = 'answered',
  notAnswered = 'notAnswered',
  expired = 'expired',
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

  @Field({ nullable: true })
  organization?: string
}

@ObjectType('QuestionnairesList')
export class QuestionnairesList {
  @Field(() => [QuestionnairesBaseItem], { nullable: true })
  questionnaires?: Array<QuestionnairesBaseItem>
}
