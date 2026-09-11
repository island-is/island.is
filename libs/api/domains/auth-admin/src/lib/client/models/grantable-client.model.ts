import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ClientType } from '../../models/client-type.enum'
import { TranslatedValue } from '../../models/translated-value.model'

@ObjectType('AuthAdminGrantableClient')
export class GrantableClient {
  @Field(() => ID)
  clientId!: string

  @Field(() => String)
  tenantId!: string

  @Field(() => ClientType)
  clientType!: ClientType

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]
}
