import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('RightsPortalAidOrNutritionRenewInput')
export class RenewAidsOrNutritionInput {
  @Field()
  @IsString()
  id!: string
}
