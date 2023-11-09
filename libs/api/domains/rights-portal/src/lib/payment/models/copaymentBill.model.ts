import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalCopaymentBill')
export class CopaymentBill {
  @Field(() => Int, { nullable: true })
  id?: number | null

  @Field(() => String, { nullable: true })
  serviceType?: string | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => Int, { nullable: true })
  totalAmount?: number | null

  @Field(() => Int, { nullable: true })
  insuranceAmount?: number | null

  @Field(() => Int, { nullable: true })
  ownAmount?: number | null

  @Field(() => Int, { nullable: true })
  overpaid?: number | null
}
