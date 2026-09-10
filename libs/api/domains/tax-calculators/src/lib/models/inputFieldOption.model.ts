import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TaxCalculatorInputFieldOption')
export class InputFieldOption {
  @Field({
    description:
      'The value to submit when this option is chosen. A raw identifier carrying no display text -- the consumer supplies its own label.',
  })
  value!: string
}
