import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteApplicationInput {
  @Field(() => String)
  id!: string
}
