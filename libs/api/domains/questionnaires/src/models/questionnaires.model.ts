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

@ObjectType('QuestionnaireSection')
export class QuestionnaireSection {
  @Field({ nullable: true })
  sectionTitle?: string

  @Field(() => [Question], { nullable: true })
  questions?: Question[]
}

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

  @Field(() => [QuestionnaireSection], { nullable: true })
  sections?: QuestionnaireSection[]
}

@ObjectType('QuestionnairesList')
export class QuestionnairesList {
  @Field(() => [Questionnaire], { nullable: true })
  questionnaires?: Array<Questionnaire>
}
