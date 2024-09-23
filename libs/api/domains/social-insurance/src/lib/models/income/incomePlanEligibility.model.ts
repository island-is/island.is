import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceIncomePlanEligbility')
export class IncomePlanEligbility {
  @Field({ nullable: true })
  isEligible?: boolean

  @Field({ nullable: true })
  reason?: string
}
