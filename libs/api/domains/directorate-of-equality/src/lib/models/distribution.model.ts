import { Field, Float, ObjectType } from '@nestjs/graphql'

import { DistributionPoint } from './distributionPoint.model'
import { DirectorateOfEqualityMarkedKind } from './enums'
import { ExpectedWage } from './expectedWage.model'

@ObjectType('DirectorateOfEqualityDistribution')
export class Distribution {
  @Field(() => [DistributionPoint])
  points!: DistributionPoint[]

  @Field(() => DirectorateOfEqualityMarkedKind, {
    nullable: true,
    description: 'Null when no point is marked',
  })
  markedKind?: DirectorateOfEqualityMarkedKind

  @Field(() => [ExpectedWage], {
    description:
      'Samples of the fitted expected-wage curve, lowest to highest score; empty when no fit is identifiable',
  })
  expectedLine!: ExpectedWage[]

  @Field(() => Float, {
    nullable: true,
    description: 'Percent increase in expected wage per 100 score points',
  })
  increasePer100PointsPercent?: number

  @Field(() => Float, {
    nullable: true,
    description: 'Expected regular hourly wage at the mean score, kr./klst.',
  })
  expectedWageAtMeanScore?: number
}
