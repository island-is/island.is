import { Field, Float, ObjectType } from '@nestjs/graphql'

import { DirectorateOfEqualityGapDirection } from './enums'

@ObjectType('DirectorateOfEqualityGap')
export class Gap {
  @Field(() => Float, { description: 'Magnitude in percent, e.g. 3.9' })
  percent!: number

  @Field(() => DirectorateOfEqualityGapDirection)
  direction!: DirectorateOfEqualityGapDirection
}
