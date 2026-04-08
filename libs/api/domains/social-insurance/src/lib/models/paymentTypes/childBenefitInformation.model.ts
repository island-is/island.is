import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceChildBenefitInformation')
export class ChildBenefitInformation {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string
}
