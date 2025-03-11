import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('VehiclesMileageV3PutResponse')
export class PutResponse {
  @Field(() => Int, { nullable: true })
  internalId?: number
}
