import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class MunicipalitiesFinancialAidSignedUrlModel {
  @Field()
  readonly url!: string
  @Field()
  readonly key!: string
}
