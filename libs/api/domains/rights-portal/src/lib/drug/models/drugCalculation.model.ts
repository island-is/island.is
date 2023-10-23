import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDrugCalculation')
export class DrugCalculation {
  @Field(() => Number, { nullable: true })
  lineNumber?: number | null

  @Field(() => Number, { nullable: true })
  referencePrice?: number | null

  @Field(() => Number, { nullable: true })
  customerPrice?: number | null

  @Field(() => Number, { nullable: true })
  calculatedCustomerPrice?: number | null

  @Field(() => Number, { nullable: true })
  insurancePrice?: number | null

  @Field(() => Number, { nullable: true })
  excessPrice?: number | null

  @Field(() => Number, { nullable: true })
  fullPrice?: number | null

  @Field(() => String, { nullable: true })
  comment?: string | null
}
