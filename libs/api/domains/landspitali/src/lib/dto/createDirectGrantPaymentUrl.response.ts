import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebLandspitaliCreateDirectGrantPaymentUrlResponse')
export class CreateDirectGrantPaymentUrlResponse {
  @Field(() => String)
  url!: string
}
