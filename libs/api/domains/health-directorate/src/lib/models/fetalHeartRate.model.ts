import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateFetalHeartRate')
export class FetalHeartRate {
  @Field()
  identifier!: string

  @Field(() => Int, { nullable: true })
  soundLower?: number

  @Field(() => Int, { nullable: true })
  soundUpper?: number

  @Field(() => Int, { nullable: true })
  position?: number
}
