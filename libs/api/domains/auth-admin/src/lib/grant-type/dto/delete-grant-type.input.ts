import { Field, InputType } from '@nestjs/graphql'

@InputType('DeleteAuthAdminGrantTypeInput')
export class DeleteGrantTypeInput {
  @Field(() => String)
  name!: string
}
