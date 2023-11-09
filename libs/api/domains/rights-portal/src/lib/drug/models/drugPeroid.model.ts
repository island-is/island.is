import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDrugPeriod')
export class DrugPeriod {
  @Field(() => ID, { nullable: true })
  id?: number | null

  @Field(() => Date, { nullable: true })
  dateFrom?: Date | null

  @Field(() => Date, { nullable: true })
  dateTo?: Date | null

  @Field(() => Boolean, { nullable: true })
  active?: boolean | null

  @Field(() => Number, { nullable: true })
  paidAmount?: number | null

  @Field(() => Number, { nullable: true })
  paymentStatus?: number | null

  @Field(() => Number, { nullable: true })
  numberOfBills?: number | null

  @Field(() => Number, { nullable: true })
  levelNumber?: number | null

  @Field(() => Number, { nullable: true })
  levelPercentage?: number | null
}
