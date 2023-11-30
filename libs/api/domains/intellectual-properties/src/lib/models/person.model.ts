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
  postalCode?: string

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  county?: string

  @Field(() => Country, { nullable: true })
  country?: Country

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  telephone?: string

  @Field(() => String, { nullable: true })
  mobilePhone?: string

  @Field({ nullable: true })
  isForeign?: boolean

  @Field(() => String, { nullable: true })
  ssn?: string
}
