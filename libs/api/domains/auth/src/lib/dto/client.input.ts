import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthClientInput')
export class ClientInput {
  @Field(() => String)
  lang = 'is'

  @Field(() => String)
  clientId!: string
}
