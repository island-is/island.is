import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class IdentitiesInput {
  @Field(() => [String])
  nationalIds!: Array<string>
}
