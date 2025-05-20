import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralUnionModel')
export class UnionModel {
  @Field(() => String, { nullable: true })
  nationalId!: string | null | undefined

  @Field({ nullable: true })
  name!: string
}
