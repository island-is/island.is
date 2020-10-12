import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserProfileInput {
  @Field(() => String)
  string!: string
}
