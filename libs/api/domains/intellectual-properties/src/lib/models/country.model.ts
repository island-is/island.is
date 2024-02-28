import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesCountry')
export class Country {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  code?: string
}
