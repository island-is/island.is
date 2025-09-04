import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Question } from './question.model'

export enum QuestionnariesStatusEnum {
  answered = 'answered',
  notAnswered = 'notAnswered',
  expired = 'expired',
}
registerEnumType(QuestionnariesStatusEnum, {
  name: 'QuestionnariesStatusEnum',
})

@ObjectType('Questionnaire')
export class Questionnaire {
  @Field()
  id!: string

  @Field()
  title!: string

  @Field()
  sentDate!: string

  @Field(() => QuestionnariesStatusEnum)
  status!: QuestionnariesStatusEnum

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  organization?: string

  @Field(() => [Question], { nullable: true })
  questions?: Question[]
}

@ObjectType('QuestionnariesList')
export class QuestionnariesList {
  @Field(() => [Questionnaire], { nullable: true })
  questionnaires?: Array<Questionnaire>
}
