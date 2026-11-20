import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

import { DirectorateOfEqualityGapDirection } from './enums'

@ObjectType('DirectorateOfEqualityGap')
export class Gap {
  @Field(() => Float, { description: 'Magnitude in percent, e.g. 3.9' })
  percent!: number

  @Field(() => DirectorateOfEqualityGapDirection)
  direction!: DirectorateOfEqualityGapDirection
}

@ObjectType('DirectorateOfEqualityAdjustedGap')
export class AdjustedGap {
  @Field(() => Float, { description: 'Magnitude in percent, e.g. 3.9' })
  percent!: number

  @Field(() => DirectorateOfEqualityGapDirection)
  direction!: DirectorateOfEqualityGapDirection

  @Field(() => Float, { description: 'The legal benchmark in percent' })
  benchmarkPercent!: number

  @Field(() => Boolean, {
    nullable: true,
    description: 'Null when it cannot be determined — neither within nor above',
  })
  withinBenchmark?: boolean | null

  @Field(() => Int, {
    description:
      'Fewest employees whose pay must be accounted for in the improvement plan; 0 when within the benchmark',
  })
  outlierCount!: number
}
