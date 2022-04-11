import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FinancialAidMunicipalitiesSignedUrlModel {
  @Field()
  readonly url!: string
  @Field()
  readonly key!: string
}
