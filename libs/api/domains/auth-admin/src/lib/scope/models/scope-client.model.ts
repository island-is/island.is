import { Field, ObjectType } from '@nestjs/graphql'

import { TranslatedValue } from '../../models/translated-value.model'

@ObjectType('AuthAdminScopeClient')
export class ScopeClient {
  @Field(() => String)
  clientId!: string

  @Field(() => String)
  clientType!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]
}
