import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminDeleteClientInput')
export class DeleteClientInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  clientId!: string
}
