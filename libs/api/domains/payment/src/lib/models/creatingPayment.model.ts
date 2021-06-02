import { Field, ObjectType } from '@nestjs/graphql'
import { ChargeResponse } from '@island.is/clients/payment'

@ObjectType()
export class CreatingPaymentModel {
  @Field(() => String)
  user4!: string

  @Field(() => String)
  receptionID!: string
}
