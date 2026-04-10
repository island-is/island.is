import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceBenefitChildInformation')
export class BenefitChildInformation {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  nationalId?: string
}
