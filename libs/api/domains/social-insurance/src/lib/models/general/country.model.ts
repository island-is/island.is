import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralCountry')
export class Country {
  @Field()
  code!: string

  @Field({ nullable: true })
  name?: string
}
