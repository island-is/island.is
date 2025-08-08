import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreateDirectGrantPaymentUrlResponse {
  @Field(() => String)
  url!: string
}
