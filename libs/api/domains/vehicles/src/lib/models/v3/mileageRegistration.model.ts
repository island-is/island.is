import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('VehiclesMileageRegistration')
export class MileageRegistration {
  @Field()
  originCode!: string

  @Field(() => Int)
  mileage!: number

  @Field({ description: 'ISO8601' })
  date!: string

  @Field(() => Int, { nullable: true })
  internalId?: number

  @Field({ nullable: true })
  operation?: string

  @Field({ nullable: true, description: 'ISO8601' })
  transactionDate?: string
}
