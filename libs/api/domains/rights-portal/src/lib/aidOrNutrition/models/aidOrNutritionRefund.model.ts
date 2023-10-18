import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('RightsPortalAidOrNutritionRefund')
export class Refund {
  @Field()
  type!: string
  @Field(() => Int)
  value!: number
}
