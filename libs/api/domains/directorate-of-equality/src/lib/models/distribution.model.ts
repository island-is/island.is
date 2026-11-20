import { Field, Float, ObjectType } from '@nestjs/graphql'

import {
  DirectorateOfEqualityGender,
  DirectorateOfEqualityMarkedKind,
} from './enums'

@ObjectType('DirectorateOfEqualityDistributionPoint')
export class DistributionPoint {
  @Field(() => Float, { description: 'Job evaluation score (starfsmatsstig)' })
  score!: number

  @Field(() => Float, { description: 'Regular hourly wage, kr./klst.' })
  wage!: number

  @Field(() => DirectorateOfEqualityGender)
  gender!: DirectorateOfEqualityGender

  @Field(() => Boolean, {
    description: 'See DirectorateOfEqualityDistribution.markedKind',
  })
  marked!: boolean
}

@ObjectType('DirectorateOfEqualityExpectedWage')
export class ExpectedWage {
  @Field(() => Float)
  score!: number

  @Field(() => Float, {
    description: 'Expected regular hourly wage at this score, kr./klst.',
  })
  wage!: number
}

@ObjectType('DirectorateOfEqualityDistribution')
export class Distribution {
  @Field(() => [DistributionPoint])
  points!: DistributionPoint[]

  @Field(() => DirectorateOfEqualityMarkedKind, {
    nullable: true,
    description: 'Null when no point is marked',
  })
  markedKind?: DirectorateOfEqualityMarkedKind | null

  @Field(() => [ExpectedWage], {
    description:
      'Samples of the fitted expected-wage curve, lowest to highest score; empty when no fit is identifiable',
  })
  expectedLine!: ExpectedWage[]

  @Field(() => Float, {
    nullable: true,
    description: 'Percent increase in expected wage per 100 score points',
  })
  increasePer100PointsPercent?: number | null

  @Field(() => Float, {
    nullable: true,
    description: 'Expected regular hourly wage at the mean score, kr./klst.',
  })
  expectedWageAtMeanScore?: number | null
}
