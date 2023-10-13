import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalCopaymentBill')
export class CopaymentBill {
  @Field(() => Number, { nullable: true })
  id?: number | null

  @Field(() => String, { nullable: true })
  serviceType?: string | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => Number, { nullable: true })
  totalAmount?: number | null

  @Field(() => Number, { nullable: true })
  insuranceAmount?: number | null

  @Field(() => Number, { nullable: true })
  ownAmount?: number | null

  @Field(() => Number, { nullable: true })
  overpaid?: number | null
}
