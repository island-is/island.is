import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class IdentityInput {
  @Field(() => String)
  nationalId!: string
}
