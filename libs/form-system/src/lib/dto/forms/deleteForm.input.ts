import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDeleteFormInput')
export class DeleteFormInput {
  @Field(() => String)
  id!: string
}
