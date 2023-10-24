import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalCopaymentPeriod')
export class CopaymentPeriod {
  @Field(() => Number, { nullable: true })
  id?: number | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  month?: string | null

  @Field(() => Number, { nullable: true })
  maximumPayment?: number | null

  @Field(() => Number, { nullable: true })
  monthPayment?: number | null

  @Field(() => Number, { nullable: true })
  overpaid?: number | null

  @Field(() => Number, { nullable: true })
  repaid?: number | null
}
