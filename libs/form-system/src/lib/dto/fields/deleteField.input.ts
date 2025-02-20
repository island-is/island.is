import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDeleteFieldInput')
export class DeleteFieldInput {
  @Field(() => String)
  id!: string
}
