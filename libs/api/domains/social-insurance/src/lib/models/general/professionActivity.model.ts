import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralProfessionActivity')
export class ProfessionActivity {
  @Field({ nullable: true })
  description?: string

  @Field()
  value!: string
}
