import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleRegistration {
  @Field(() => String, { nullable: true })
  modelName?: string

  @Field(() => String, { nullable: true })
  manufacturer?: string

  @Field(() => String, { nullable: true })
  licensePlate?: string

  @Field(() => String, { nullable: true })
  color?: string
}
