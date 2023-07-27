import { Field, ObjectType } from '@nestjs/graphql'
import { UserAdviceResult } from './userAdviceResult.model'

@ObjectType('ConsultationPortalUserAdviceAggregate')
export class UserAdviceAggregate {
  @Field({ nullable: true })
  total?: number

  @Field(() => [UserAdviceResult], { nullable: true })
  advices?: Array<UserAdviceResult> | null
}
