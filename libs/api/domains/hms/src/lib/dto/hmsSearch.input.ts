import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HmsSearchInput {
  @Field()
  partialStadfang!: string
}
