import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TaxCalculatorBooleanInputDependencyValue')
export class BooleanInputDependencyValue {
  @Field()
  value!: boolean
}
