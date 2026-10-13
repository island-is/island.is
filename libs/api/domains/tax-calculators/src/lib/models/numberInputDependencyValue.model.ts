import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('TaxCalculatorNumberInputDependencyValue')
export class NumberInputDependencyValue {
  @Field(() => Float)
  value!: number
}
