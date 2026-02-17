import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePregnancyMeasurement')
export class PregnancyMeasurement {
  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => Float, { nullable: true })
  weightKg?: number

  @Field(() => Float, { nullable: true })
  fundalHeightCm?: number

  @Field({ nullable: true })
  bloodPressure?: string

  @Field(() => Float, { nullable: true })
  pulsePerMin?: number

  @Field({ nullable: true })
  proteinInUrine?: string
}

@ObjectType('HealthDirectoratePregnancyMeasurements')
export class PregnancyMeasurements {
  @Field(() => [PregnancyMeasurement])
  data!: PregnancyMeasurement[]
}
