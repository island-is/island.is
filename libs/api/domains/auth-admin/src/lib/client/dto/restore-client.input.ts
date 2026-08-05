import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminRestoreClientInput')
export class RestoreClientInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  clientId!: string
}
