import { Field, ObjectType } from '@nestjs/graphql'
import { DrugCalculation } from './drugCalculation.model'

@ObjectType('RightsPortalDrugCalculatorResponse')
export class DrugCalculatorResponse {
  @Field(() => [DrugCalculation], { nullable: true })
  drugs?: DrugCalculation[] | null

  @Field(() => Number, { nullable: true })
  totalUnits?: number | null

  @Field(() => Number, { nullable: true })
  totalPrice?: number | null

  @Field(() => Number, { nullable: true })
  totalCustomerPrice?: number | null
}
