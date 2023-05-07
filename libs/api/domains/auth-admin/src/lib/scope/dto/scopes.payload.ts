import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { ScopeResponse } from './scope.response'

@ObjectType('AuthAdminScopesPayload')
export class ScopesPayload extends PaginatedResponse(ScopeResponse) {}
