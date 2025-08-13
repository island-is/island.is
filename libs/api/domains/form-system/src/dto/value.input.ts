import { InputType, Field, Int } from '@nestjs/graphql'
import { ApplicationEventDtoInput } from './application.input'

@InputType('FormSystemMonthInput')
export class MonthInput {
  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  amount?: number

  @Field(() => [Int], { nullable: true })
  days?: number[]
}

@InputType('FormSystemValueInput')
export class ValueInput {
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

  @Field(() => [MonthInput], { nullable: 'itemsAndList' })
  months?: MonthInput[]

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

@InputType('FormSystemValueDtoInput')
export class ValueDtoInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Int, { nullable: true })
  order?: number

  @Field(() => ValueInput, { nullable: true })
  json?: ValueInput

  @Field(() => [ApplicationEventDtoInput], { nullable: 'itemsAndList' })
  events?: ApplicationEventDtoInput[]
}
