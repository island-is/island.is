import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('MunicipalitiesFinancialAidCurrentApplication')
export class CurrentApplicationResponse {
  @Field({ nullable: true })
  currentApplicationId?: string
}
