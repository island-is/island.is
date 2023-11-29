import { ObjectType, Field } from '@nestjs/graphql'
import { Country } from './country.model'

@ObjectType('IntellectualPropertyDesignPerson')
export class Person {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => String, { nullable: true })
  postalcode?: string

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  country?: string

  @Field(() => Country, { nullable: true })
  countryDetails?: Country

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  telephone?: string

  @Field(() => String, { nullable: true })
  mobilephone?: string

  @Field(() => String, { nullable: true })
  ssn?: string
}
