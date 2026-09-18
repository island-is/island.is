import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { PregnancyStaff } from './pregnancyStaff.model'

@ObjectType('HealthDirectorateActivePregnancy')
export class ActivePregnancy {
  @Field(() => ID)
  id!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date

  @Field(() => Int, { nullable: true })
  lengthWeeks?: number

  @Field(() => Int, { nullable: true })
  lengthDays?: number

  @Field(() => Int, { nullable: true })
  numberOfEmbryos?: number

  @Field({ nullable: true })
  motherName?: string

  @Field({ nullable: true })
  partnerName?: string

  @Field(() => [PregnancyStaff])
  staff!: PregnancyStaff[]

  @Field({ nullable: true })
  endedWithBirth?: boolean

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date
}
