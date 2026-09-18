import { Field, Float, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

/* A GraphQL one-of input: every member must be declared nullable with no
 * default or schema construction throws, which reads backwards here --
 * exclusivity comes from the directive, not from nullability.
 *
 * `{}` and `{ stringValue: null }` are rejected during variable coercion and
 * surface as a top-level error, not in `errors`, so a cleared control must omit
 * its whole row rather than send an empty payload. */
@InputType('TaxCalculatorInputValue', {
  isOneOf: true,
  description:
    'One submitted value. Exactly one member is set, and which one must match the field’s `type` in the metadata contract: `number` uses `numberValue`, `boolean` uses `booleanValue`, and `string`, `date` and `select` all use `stringValue`.',
})
export class InputValue {
  @Field(() => Float, {
    nullable: true,
    description:
      'Set for a `number` field. Percentages are whole percent (`37`, not `0.37`) and months are `1-12`.',
  })
  @IsOptional()
  @IsNumber()
  numberValue?: number

  @Field({
    nullable: true,
    description:
      'Set for a `string`, `date` or `select` field. Dates are `yyyy-MM-dd`; select values must be one of the field’s `options`.',
  })
  @IsOptional()
  @IsString()
  stringValue?: string

  @Field({
    nullable: true,
    description: 'Set for a `boolean` field.',
  })
  @IsOptional()
  @IsBoolean()
  booleanValue?: boolean
}
