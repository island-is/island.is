import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralUnionModel')
export class UnionModel {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}
