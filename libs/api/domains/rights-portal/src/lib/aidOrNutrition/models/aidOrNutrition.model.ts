import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  AidOrNutritionRenewalStatus,
  AidOrNutritionType,
} from '../utils/generateAidOrNutrition'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Refund } from './aidOrNutritionRefund.model'

registerEnumType(AidOrNutritionRenewalStatus, {
  name: 'RightsPortalAidOrNutritionRenewalStatus',
})

registerEnumType(AidOrNutritionType, {
  name: 'RightsPortalAidOrNutritionType',
})

@ObjectType('RightsPortalAidOrNutrition')
export class AidOrNutrition {
  @Field(() => ID)
  id!: number

  @Field(() => AidOrNutritionType)
  type!: AidOrNutritionType

  @Field()
  iso!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  maxUnitRefund?: string

  @Field({ nullable: true })
  maxMonthlyAmount?: number

  @Field(() => Refund)
  refund!: Refund

  @Field({ nullable: true })
  available?: string

  @Field(() => [String], { nullable: true })
  location?: string[]

  @Field({ nullable: true })
  explanation?: string

  @Field({ nullable: true })
  validUntil?: Date

  @Field({ nullable: true })
  allowed12MonthPeriod?: number

  @Field({ nullable: true })
  nextAllowedMonth?: string

  @Field()
  expiring!: boolean

  @Field({ nullable: true })
  valid?: boolean

  @Field(() => AidOrNutritionRenewalStatus, { nullable: true })
  renewalStatus?: AidOrNutritionRenewalStatus
}

@ObjectType('RightsPortalPaginatedAidsOrNutrition')
export class PaginatedAidOrNutritionResponse extends PaginatedResponse(
  AidOrNutrition,
) {}
