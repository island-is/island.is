import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('RightsPortalBill')
export class Bill {
  @Field(() => Int, { nullable: true })
  number?: number | null

  @Field(() => Int, { nullable: true })
  amount?: number | null

  @Field(() => Int, { nullable: true })
  coveredAmount?: number | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => Date, { nullable: true })
  refundDate?: Date | null
}
