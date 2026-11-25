import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TaxCalculatorInputFieldOption')
export class InputFieldOption {
  @Field()
  value!: string
}
