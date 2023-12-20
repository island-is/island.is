import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthLoginRestrictionInput')
export class LoginRestrictionInput {
  @Field(() => Date)
  until!: Date
}
