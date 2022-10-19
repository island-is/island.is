import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationsInput')
export class DelegationsInput {
  @Field(() => String, { nullable: true })
  domain?: string
}
