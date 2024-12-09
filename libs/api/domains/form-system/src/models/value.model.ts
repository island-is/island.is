import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Month } from './month.model'

@ObjectType('FormSystemValue')
export class Value {
  @Field(() => String, { nullable: true })
  text?: string

  @Field(() => Int, { nullable: true })
  number?: number

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => String, { nullable: true })
  kennitala?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => String, { nullable: true })
  postalCode?: string

  @Field(() => String, { nullable: true })
  municipality?: string

  @Field(() => String, { nullable: true })
  jobTitle?: string

  @Field(() => String, { nullable: true })
  altName?: string

  @Field(() => String, { nullable: true })
  homestayNumber?: string

  @Field(() => Int, { nullable: true })
  totalDays?: number

  @Field(() => Int, { nullable: true })
  totalAmount?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Boolean, { nullable: true })
  isNullReport?: boolean

  @Field(() => [Month], { nullable: true })
  months?: Month[]
}

@ObjectType('FormSystemValueDto')
export class ValueDto {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Int, { nullable: true })
  order?: number

  @Field(() => Value, { nullable: true })
  json?: Value
}
