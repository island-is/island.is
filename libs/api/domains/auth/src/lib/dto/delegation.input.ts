import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationInput')
export class DelegationInput {
  @Field((_) => String)
  toNationalId!: string
}
