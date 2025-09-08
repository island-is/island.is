import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralHousingType')
export class HousingType {
  @Field(() => Int)
  value!: number

  @Field({ nullable: true })
  label?: string
}
