import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemOption')
export class Option {
  @Field(() => String)
  value!: string

  @Field(() => String)
  label!: string

  @Field(() => Boolean)
  isSelected!: boolean
}
