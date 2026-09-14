import { Field, ObjectType } from '@nestjs/graphql'

import { CustomsGeneralValidity } from './customsGeneralValidity.model'

@ObjectType()
export class CustomsGeneralCountryCurrency extends CustomsGeneralValidity {
  @Field(() => String, { nullable: true })
  countryCode?: string

  @Field(() => String, { nullable: true })
  countryName?: string

  @Field(() => String, { nullable: true })
  currencyCode?: string

  @Field(() => String, { nullable: true })
  currencyName?: string
}
