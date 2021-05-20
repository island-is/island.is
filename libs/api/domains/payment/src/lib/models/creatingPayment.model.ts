import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreatingPaymentModel {
  @Field()
  systemID!: string

  @Field()
  performingOrgID!: string

  @Field()
  payeeNationalID!: string

  @Field()
  chargeType!: string

  @Field()
  chargeItemSubject!: string

  @Field()
  performerNationalID!: string

  @Field()
  charges!: []

  @Field()
  payInfo?: []
}