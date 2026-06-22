import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralCountryCurrency {
  @Field(() => String, { nullable: true })
  countryCode?: string

  @Field(() => String, { nullable: true })
  countryName?: string

  @Field(() => String, { nullable: true })
  currencyCode?: string

  @Field(() => String, { nullable: true })
  currencyName?: string
}
