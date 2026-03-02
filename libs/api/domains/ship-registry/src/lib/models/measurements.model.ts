import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryMeasurements')
export class ShipRegistryMeasurements {
  @Field(() => Float)
  length!: number

  @Field(() => Float)
  mostLength!: number

  @Field(() => Float)
  width!: number

  @Field(() => Float)
  depth!: number

  @Field(() => Float)
  bruttoGrt!: number

  @Field(() => Float)
  nettoWeightTons!: number
}
