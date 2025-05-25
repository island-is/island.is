import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType('RightsPortalAidOrNutritionRenew')
export class Renew {
  @Field(() => Boolean, { nullable: true })
  success?: boolean

  @Field(() => Float, { nullable: true })
  requestId?: number

  @Field(() => String, { nullable: true })
  errorMessage?: string
}
