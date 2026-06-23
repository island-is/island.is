import { Field, ObjectType } from '@nestjs/graphql'
import { YearWithMonths } from './taxCardMonthsAndYears.model'

@ObjectType('SocialInsurancePersonalTaxCreditSpouseInfo')
export class PersonalTaxCreditSpouseInfo {
  @Field()
  nationalId!: string

  @Field({
    nullable: true,
    description: "The spouse's full name",
  })
  name?: string

  @Field({
    nullable: true,
    description: 'Whether the spouse is deceased',
  })
  isDeceased?: boolean

  @Field(() => [YearWithMonths], {
    nullable: true,
    description: 'Valid year/month combinations for deceased spouse tax card',
  })
  deceasedMonthsAndYears?: YearWithMonths[]

  @Field({
    nullable: true,
    description:
      'Code explaining why the deceased spouse tax card cannot be applied',
  })
  deceasedReasonNotAllowedCode?: string
}
