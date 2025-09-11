import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsRequestedPeriod')
export class RequestedPeriod {
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date

  @Field(() => Int, { nullable: true })
  totalRequestedMonths?: number
}
