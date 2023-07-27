import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalStatisticsResult')
export class StatisticsResult {
  @Field({ nullable: true })
  totalCases?: number

  @Field({ nullable: true })
  totalAdvices?: number

  @Field({ nullable: true })
  casesInReview?: number
}
