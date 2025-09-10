import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebLandspitaliCreateMemorialCardPaymentUrlResponse')
export class CreateMemorialCardPaymentUrlResponse {
  @Field(() => String)
  url!: string
}
