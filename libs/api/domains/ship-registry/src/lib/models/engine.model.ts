import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryEngine')
export class ShipRegistryEngine {
  @Field(() => Float, { nullable: true })
  power?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field({ nullable: true })
  usage?: string

  @Field({ nullable: true })
  manufacturer?: string
}
