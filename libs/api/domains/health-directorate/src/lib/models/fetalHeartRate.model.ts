import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePregnancyFetalHeartRate')
export class FetalHeartRate {
  @Field({ nullable: true })
  identifier?: string

  @Field(() => Int, { nullable: true })
  soundLower?: number

  @Field(() => Int, { nullable: true })
  soundUpper?: number

  @Field(() => Int, { nullable: true })
  position?: number
}
