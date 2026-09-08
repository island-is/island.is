import { Field, ObjectType } from '@nestjs/graphql'
import { StepStatus } from './stepStatus.model'
import { Action } from './action.model'

@ObjectType('EstatesNextStep')
export class NextStep {
  @Field({ nullable: true, description: 'Next step code from the API' })
  code?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  detailedDescription?: string

  @Field(() => StepStatus, { nullable: true })
  stepStatus?: StepStatus

  @Field(() => Action, { nullable: true })
  action?: Action
}
