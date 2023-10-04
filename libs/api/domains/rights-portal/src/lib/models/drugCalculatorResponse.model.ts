import { Field, ObjectType } from '@nestjs/graphql'
import { Drug } from './drugs.model'

@ObjectType('RightsPortalDrugCalculationOut')
export class DrugCalculationOut {
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

@ObjectType('RightsPortalDrugCalculatorResponse')
export class DrugCalculatorResponse {
  @Field(() => [DrugCalculationOut], { nullable: true })
  drugs?: DrugCalculationOut[] | null

  @Field(() => Number, { nullable: true })
  totalUnits?: number | null

  @Field(() => Number, { nullable: true })
  totalPrice?: number | null

  @Field(() => Number, { nullable: true })
  totalCustomerPrice?: number | null
}
