import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralUnionModel')
export class UnionModel {
  @Field()
  nationalId!: string

  @Field()
  name!: string
}
