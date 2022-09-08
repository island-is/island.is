import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('MunicipalitiesFinancialAidSpouseEmailResponse')
export class SpouseEmailResponse {
  @Field()
  readonly success!: boolean
}
