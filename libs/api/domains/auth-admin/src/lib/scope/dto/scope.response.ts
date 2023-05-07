import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ScopeDTO } from './scope.dto'

@ObjectType('AuthAdminScopeResponse')
export class ScopeResponse {
  @Field(() => ScopeDTO, { nullable: false })
  scope!: ScopeDTO

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
