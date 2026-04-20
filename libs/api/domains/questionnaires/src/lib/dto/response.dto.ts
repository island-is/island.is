import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('QuestionnairesResponse')
export class QuestionnairesResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  message?: string
}
