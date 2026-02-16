import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePregnancyMeasurement')
export class PregnancyMeasurement {
  @Field()
  date!: string

  @Field(() => Float, { nullable: true })
  weightKg?: number | null

  @Field(() => Float, { nullable: true })
  fundalHeightCm?: number | null

  @Field({ nullable: true })
  bloodPressure?: string | null

  @Field(() => Float, { nullable: true })
  pulsePerMin?: number | null

  @Field({ nullable: true })
  proteinInUrine?: string | null
}

@ObjectType('HealthDirectoratePregnancyMeasurements')
export class PregnancyMeasurements {
  @Field(() => [PregnancyMeasurement])
  data!: PregnancyMeasurement[]
}
