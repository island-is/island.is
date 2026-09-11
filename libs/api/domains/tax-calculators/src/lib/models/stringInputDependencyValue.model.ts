import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TaxCalculatorStringInputDependencyValue')
export class StringInputDependencyValue {
  @Field()
  value!: string
}
