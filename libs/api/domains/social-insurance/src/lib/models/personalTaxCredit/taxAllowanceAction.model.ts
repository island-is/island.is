import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceTaxAllowanceAction')
export class TaxAllowanceAction {
  @Field(() => Int)
  value!: number

  @Field()
  name!: string
}
