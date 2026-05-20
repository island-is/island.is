import { Field, ObjectType } from '@nestjs/graphql'

import { Client } from '../models/client.model'

@ObjectType('AuthAdminClientsByTenant')
export class ClientsByTenant {
  @Field(() => String)
  tenantId!: string

  @Field(() => [Client])
  data!: Client[]
}

@ObjectType('AuthAdminClientsByTenantsPayload')
export class ClientsByTenantsPayload {
  @Field(() => [ClientsByTenant])
  data!: ClientsByTenant[]
}
