import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TaxCalculatorFieldOption')
export class FieldOption {
  @Field(() => String)
  value!: string

  @Field(() => String)
  label!: string
}
