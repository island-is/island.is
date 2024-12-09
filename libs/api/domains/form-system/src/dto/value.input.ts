import { InputType, Field, Int } from '@nestjs/graphql'

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

  @Field(() => [MonthInput], { nullable: true })
  months?: MonthInput[]
}

@InputType('FormSystemValueDtoInput')
export class ValueDtoInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Int, { nullable: true })
  order?: number

  @Field(() => ValueInput, { nullable: true })
  json?: ValueInput
}
