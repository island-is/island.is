import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TaxCalculatorFieldDependency')
export class FieldDependency {
  @Field({
    description:
      'The `key` of the sibling field this one is conditional on. Not this field\'s own key.',
  })
  field!: string

  /* Boolean by deliberate choice, not by accident: every discriminated union
   * across the four exposed calculators discriminates on a zod boolean
   * literal. TaxCalculatorsService warns and drops the dependency if RSK ever
   * introduces a non-boolean discriminant, rather than widening this type
   * speculatively. */
  @Field({
    description:
      'The value `field` must hold for this field to apply. When it does not, the field is neither shown nor submitted.',
  })
  equals!: boolean
}
