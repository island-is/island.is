import { Field, ObjectType } from '@nestjs/graphql'
import { ChargeResponse } from '@island.is/clients/payment'

@ObjectType()
export class CreatingPaymentModel {
  @Field()
  user4!: string

  @Field()
  receptionID!: string
}