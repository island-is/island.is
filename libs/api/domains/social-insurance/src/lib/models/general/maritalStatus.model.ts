import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralMaritalStatus')
export class MaritalStatus {
  @Field(() => Int)
  value!: number

  @Field({ nullable: true })
  label?: string
}
