import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RskCalculatorFieldOption')
export class FieldOption {
  @Field(() => String)
  value!: string

  @Field(() => String)
  label!: string
}
