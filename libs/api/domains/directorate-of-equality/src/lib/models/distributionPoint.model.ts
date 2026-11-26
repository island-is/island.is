import { Field, Float, ObjectType } from '@nestjs/graphql'

import { DirectorateOfEqualityGender } from './enums'

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
