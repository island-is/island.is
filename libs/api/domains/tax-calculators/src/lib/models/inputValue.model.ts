import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql'

/* GraphQL one-of members must be nullable and have no default. Exclusivity
 * comes from the directive, not nullability. */
@InputType('TaxCalculatorInputValue', {
  isOneOf: true,
  description:
    'Typed submitted value. Set exactly one payload matching the input-field type.',
})
export class InputValue {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  numberValue?: number

  @Field({
    nullable: true,
    description: 'Value for a `STRING` or `SELECT` field.',
  })
  @IsOptional()
  @IsString()
  stringValue?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  booleanValue?: boolean

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  dateValue?: Date
}
