import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationByOtherUserInput')
export class DelegationByOtherUserInput {
  @Field(() => String)
  toNationalId!: string
}
