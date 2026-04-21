import { Field, InputType } from '@nestjs/graphql'

@InputType('OJOIAAppendixInput')
export class OJOIAAppendixInput {
  @Field()
  title!: string

  @Field()
  text!: string
}
