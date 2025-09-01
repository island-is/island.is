import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsEstimatedDuration')
export class EstimatedDuration {
  @Field(() => GraphQLISODateTime, { nullable: true })
  start?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  end?: Date

  @Field(() => Int, { nullable: true })
  months?: number
}
