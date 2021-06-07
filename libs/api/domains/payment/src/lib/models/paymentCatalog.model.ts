import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PaymentCatalog {
  @Field()
  performingOrgID!: string

  @Field()
  chargeType!: string

  @Field()
  chargeItemCode!: string

  @Field()
  chargeItemName!: string

  @Field()
  priceAmount!: number
}
