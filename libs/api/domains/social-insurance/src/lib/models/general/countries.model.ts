import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralCountries')
export class Countries {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  name?: string
}
