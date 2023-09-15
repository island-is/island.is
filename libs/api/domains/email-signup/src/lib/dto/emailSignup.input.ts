import { Field, InputType } from '@nestjs/graphql'

@InputType()
class EmailSignupInputField {
  @Field()
  id!: string
  @Field()
  name!: string
  @Field()
  value!: string
  @Field()
  type!:
    | 'input'
    | 'text'
    | 'dropdown'
    | 'radio'
    | 'acceptTerms'
    | 'email'
    | 'checkboxes'
}

@InputType()
export class EmailSignupInput {
  @Field()
  signupID!: string

  @Field(() => [EmailSignupInputField])
  inputFields!: EmailSignupInputField[]
}
