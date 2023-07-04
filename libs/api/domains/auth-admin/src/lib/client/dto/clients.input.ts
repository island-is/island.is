import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminClientsInput')
export class ClientsInput {
  @Field(() => String)
  tenantId!: string
}
