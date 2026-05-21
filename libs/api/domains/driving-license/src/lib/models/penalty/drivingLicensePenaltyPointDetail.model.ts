import { Field, ObjectType, Float } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicensePenaltyPointDetail {
  @Field()
  id!: string

  @Field()
  caseNumber!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  offenseDate?: Date

  @Field({ nullable: true })
  penalty?: string

  @Field({ nullable: true })
  penaltyStatus?: string

  @Field(() => Float, { nullable: true })
  points?: number

  @Field({ nullable: true })
  districtName?: string

  @Field({ nullable: true })
  statusCode?: string
}
