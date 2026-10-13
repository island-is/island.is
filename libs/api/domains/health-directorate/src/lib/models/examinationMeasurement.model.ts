import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql'
import { FetalHeartRate } from './fetalHeartRate.model'

@ObjectType('HealthDirectoratePregnancyMeasurement')
export class ExaminationMeasurement {
  @Field(() => ID)
  id!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date

  @Field(() => Int, { nullable: true })
  weeks?: number

  @Field(() => Int, { nullable: true })
  days?: number

  @Field(() => Float, { nullable: true })
  weight?: number

  @Field(() => Int, { nullable: true })
  pulse?: number

  @Field(() => Int, { nullable: true })
  bloodPressureUpper?: number

  @Field(() => Int, { nullable: true })
  bloodPressureLower?: number

  @Field(() => Float, { nullable: true })
  hemoglobin?: number

  @Field({ nullable: true })
  albumenInUrineScore?: string

  @Field(() => Float, { nullable: true })
  fundalHeight?: number

  @Field(() => [FetalHeartRate])
  fetalHeartRates!: FetalHeartRate[]
}
