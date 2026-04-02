import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceChildBenefitInformation')
export class ChildBenefitInformation {
  @Field()
  name!: string

  @Field({ nullable: true })
  nationalId?: string
}
