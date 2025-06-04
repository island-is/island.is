import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralUnionModel')
export class UnionModel {
  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  name?: string
}
