import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'

@InputType('FormSystemMonthInput')
@ObjectType('FormSystemMonth')
export class Month {
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  month?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  amount?: number | null

  @IsOptional()
  @ApiPropertyOptional({ type: [Number] })
  @Field(() => [Number], { nullable: true })
  days?: number[]
}

@InputType('FormSystemValueTypeInput')
@ObjectType('FormSystemValueType')
export class ValueType {
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  text?: string

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  number?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  date?: Date

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  listValue?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  nationalId?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  name?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  address?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  postalCode?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  municipality?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  jobTitle?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  altName?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  homestayNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  propertyNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  totalDays?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  totalAmount?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  year?: number

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  isNullReport?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => Month)
  @IsArray()
  @ApiPropertyOptional({ type: [Month] })
  @Field(() => [Month], { nullable: 'itemsAndList' })
  months?: Month[]

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  email?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  iskNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  checkboxValue?: boolean

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  phoneNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  bankAccount?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  time?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  s3Key?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  s3Url?: string

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  paymentCode?: string
}
