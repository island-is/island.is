import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralProfession')
export class Profession {
  @Field({ nullable: true })
  description?: string

  @Field()
  value!: string
}
