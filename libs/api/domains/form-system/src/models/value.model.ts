import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Month } from './month.model'
import { ApplicationEventDto } from './applications.model'

@ObjectType('FormSystemValue')
export class Value {
  @Field(() => String, { nullable: true })
  text?: string

  @Field(() => Int, { nullable: true })
  number?: number

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => String, { nullable: true })
  listValue?: string

  @Field(() => String, { nullable: true })
  nationalId?: string

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

  @Field(() => String, { nullable: true })
  propertyNumber?: string

  @Field(() => Int, { nullable: true })
  totalDays?: number

  @Field(() => Int, { nullable: true })
  totalAmount?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Boolean, { nullable: true })
  isNullReport?: boolean

  @Field(() => [Month], { nullable: 'itemsAndList' })
  months?: Month[]

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  iskNumber?: string

  @Field(() => Boolean, { nullable: true })
  checkboxValue?: boolean

  @Field(() => String, { nullable: true })
  phoneNumber?: string

  @Field(() => String, { nullable: true })
  bankAccount?: string

  @Field(() => String, { nullable: true })
  time?: string

  @Field(() => String, { nullable: true })
  s3Key?: string

  @Field(() => String, { nullable: true })
  s3Url?: string

  @Field(() => String, { nullable: true })
  paymentCode?: string
}

@ObjectType('FormSystemValueDto')
export class ValueDto {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Int, { nullable: true })
  order?: number

  @Field(() => Value, { nullable: true })
  json?: Value

  @Field(() => [ApplicationEventDto], { nullable: 'itemsAndList' })
  events?: ApplicationEventDto[]
}
