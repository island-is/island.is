import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsurancePersonalTaxCreditSpouseInfo')
export class PersonalTaxCreditSpouseInfo {
  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true, description: "The spouse's full name" })
  name?: string

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the spouse is deceased',
  })
  isDeceased?: boolean
}
