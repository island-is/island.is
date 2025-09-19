import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Question } from './question.model'

export enum QuestionnairesStatusEnum {
  answered = 'answered',
  notAnswered = 'notAnswered',
  expired = 'expired',
}
registerEnumType(QuestionnairesStatusEnum, {
  name: 'questionnairesStatusEnum',
})

@ObjectType('Questionnaire')
export class Questionnaire {
  @Field()
  id!: string

  @Field()
  title!: string

  @Field()
  sentDate!: string

  @Field(() => QuestionnairesStatusEnum, { nullable: true })
  status?: QuestionnairesStatusEnum

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  organization?: string

  @Field(() => [Question], { nullable: true })
  questions?: Question[]
}

@ObjectType('QuestionnairesList')
export class QuestionnairesList {
  @Field(() => [Questionnaire], { nullable: true })
  questionnaires?: Array<Questionnaire>
}
