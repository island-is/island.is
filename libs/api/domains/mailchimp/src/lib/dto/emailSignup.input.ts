import { Field, InputType } from '@nestjs/graphql'

@InputType()
class EmailSignupInputField {
  @Field()
  name!: string
  @Field()
  value!: string
  @Field()
  type!: 'input' | 'text' | 'dropdown' | 'radio' | 'acceptTerms' | 'email'
}

@InputType()
export class EmailSignupInput {
  @Field()
  signupID!: string

  @Field(() => [EmailSignupInputField])
  inputFields!: EmailSignupInputField[]
}
