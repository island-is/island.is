import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityExpectedWage')
export class ExpectedWage {
  @Field(() => Float)
  score!: number

  @Field(() => Float, {
    description: 'Expected regular hourly wage at this score, kr./klst.',
  })
  wage!: number
}
