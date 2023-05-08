import { Environment } from '@island.is/shared/types'
import { Field, ObjectType } from '@nestjs/graphql'
import { ClientAllowedScope } from '../../client/models/client-allowed-scope.model'

@ObjectType('AuthAdminScopesEnvironmentPayload')
export class ScopesEnvironmentPayload {
  @Field(() => [ClientAllowedScope], { nullable: false })
  scopes!: ClientAllowedScope[]

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
