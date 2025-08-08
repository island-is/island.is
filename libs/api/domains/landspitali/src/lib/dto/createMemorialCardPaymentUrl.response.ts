import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreateMemorialCardPaymentUrlResponse {
  @Field(() => String)
  url!: string
}
