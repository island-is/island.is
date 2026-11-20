import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityCompany')
export class Company {
  @Field(() => Boolean)
  equalityPlanRequired!: boolean

  @Field(() => Date, { nullable: true })
  nextEqualityPlanDeadline?: Date | null

  @Field(() => Boolean)
  salaryReportRequired!: boolean

  @Field(() => Date, { nullable: true })
  nextSalaryReportDeadline?: Date | null

  @Field(() => Date, {
    nullable: true,
    description:
      'When the company was approved as a service provider; null when it is not one',
  })
  serviceProviderApprovedAt?: Date | null
}
