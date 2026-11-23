import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityMeanHourlyWage')
export class MeanHourlyWage {
  @Field(() => Float, {
    nullable: true,
    description: 'Arithmetic mean regular hourly wage, kr./klst.',
  })
  male?: number

  @Field(() => Float, {
    nullable: true,
    description: 'Arithmetic mean regular hourly wage, kr./klst.',
  })
  female?: number
}
