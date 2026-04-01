import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceChildBenefitInformation')
export class ChildBenefitInformation {
  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  nationalId?: string
}
