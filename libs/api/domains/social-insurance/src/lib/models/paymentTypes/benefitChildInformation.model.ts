import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceBenefitChildInformation')
export class BenefitChildInformation {
  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  nationalId?: string
}
