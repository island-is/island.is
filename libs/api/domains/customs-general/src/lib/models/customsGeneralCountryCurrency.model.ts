import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralCountryCurrency {
  @Field(() => String)
  countryCode!: string

  @Field(() => String)
  countryName!: string

  @Field(() => Date)
  countryValidFrom!: Date

  @Field(() => Date)
  countryValidTo!: Date

  @Field(() => String)
  currencyCode!: string

  @Field(() => String)
  currencyName!: string

  @Field(() => Date)
  currencyValidFrom!: Date

  @Field(() => Date)
  currencyValidTo!: Date
}
