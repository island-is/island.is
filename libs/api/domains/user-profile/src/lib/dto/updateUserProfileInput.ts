import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserProfileInput {
  @Field(() => String)
  mobilePhoneNumber?: string

  @Field(() => String)
  locale?: string

  @Field(() => String)
  email?: string

  @Field(() => String)
  profileImageUrl?: string;
}
