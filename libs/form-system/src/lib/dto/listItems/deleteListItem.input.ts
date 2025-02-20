import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDeleteListItemInput')
export class DeleteListItemInput {
  @Field(() => String)
  id!: string
}
