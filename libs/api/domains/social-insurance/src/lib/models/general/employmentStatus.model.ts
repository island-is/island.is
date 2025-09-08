import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralEmploymentStatusItem')
export class EmploymentStatusItem {
  @Field({ nullable: true })
  displayName?: string

  @Field()
  value!: string
}

@ObjectType('SocialInsuranceGeneralEmploymentStatus')
export class EmploymentStatus {
  @Field({ nullable: true })
  languageCode?: string

  @Field(() => [EmploymentStatusItem], { nullable: true })
  employmentStatuses?: Array<EmploymentStatusItem>
}