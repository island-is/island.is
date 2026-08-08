import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RskCalculatorResultRow')
export class CalculatorResultRow {
  @Field(() => String, {
    description: 'Stable identifier for this result row.',
  })
  key!: string

  @Field(() => String, { description: 'Display label for this row.' })
  label!: string

  @Field(() => String, {
    description:
      'Raw value as a string, e.g. a stringified number. The web client formats this using `unit`.',
  })
  value!: string

  @Field(() => String, {
    nullable: true,
    description: 'Display hint for the unit of this value, e.g. "ISK" or "%".',
  })
  unit?: string

  @Field(() => String, {
    nullable: true,
    description:
      'Rows sharing the same group value should be rendered together, e.g. a tax bracket breakdown.',
  })
  group?: string

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the web client should visually emphasize this row.',
  })
  emphasis?: boolean
}
