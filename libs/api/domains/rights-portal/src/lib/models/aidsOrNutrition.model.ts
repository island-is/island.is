import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AidOrNutritionType } from '../rightsPortal.types'
import { PaginatedResponse } from '@island.is/nest/pagination'

registerEnumType(AidOrNutritionType, {
  name: 'RightsPortalAidOrNutritionType',
})

@ObjectType('RightsPortalAidOrNutritionRefund')
export class Refund {
  @Field()
  type!: string
  @Field(() => Int)
  value!: number
}

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

  @Field(() => Refund)
  refund!: Refund

  @Field({ nullable: true })
  available?: string

  @Field({ nullable: true })
  location?: string

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
}

@ObjectType('RightsPortalPaginatedAidsAndNutrition')
export class PaginatedAidsAndNutritionResponse extends PaginatedResponse(
  AidOrNutrition,
) {}
