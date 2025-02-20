import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDeleteScreenInput')
export class DeleteScreenInput {
  @Field(() => String)
  id!: string
}
