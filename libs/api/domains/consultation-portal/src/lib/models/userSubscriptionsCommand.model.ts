import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserSubscriptionsCommand {
  @Field(() => [Number], { nullable: true })
  caseIds?: number[]

  @Field(() => [Number], { nullable: true })
  institutionIds?: number[]

  @Field(() => [Number], { nullable: true })
  policyAreaIds?: number[]
}
