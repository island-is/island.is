import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetPaymentFlowInput {
  @Field((_) => String)
  id!: string
}
