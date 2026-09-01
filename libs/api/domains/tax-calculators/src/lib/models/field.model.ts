import { Field, Float, ObjectType } from '@nestjs/graphql'
import { TaxCalculatorFieldKind } from './enums'
import { FieldOption } from './fieldOption.model'

@ObjectType('TaxCalculatorField')
export class CalculatorField {
  @Field(() => String, {
    description: 'Stable identifier for this field.',
  })
  key!: string

  @Field(() => String, { description: 'Display label for this field.' })
  label!: string

  @Field(() => TaxCalculatorFieldKind, {
    description: 'Which generic input control the web client should render.',
  })
  kind!: TaxCalculatorFieldKind

  @Field(() => Boolean)
  required!: boolean

  @Field(() => String, {
    nullable: true,
    description:
      'Display hint for the unit of this field, e.g. "ISK" or "%". Present for NUMBER fields where relevant.',
  })
  unit?: string

  @Field(() => Float, { nullable: true })
  min?: number

  @Field(() => Float, { nullable: true })
  max?: number

  @Field(() => [FieldOption], {
    nullable: true,
    description: 'Populated only for SELECT fields.',
  })
  options?: FieldOption[]
}
