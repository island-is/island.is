import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { Scope } from '../models/scope.model'

@ObjectType('AuthAdminScopesPayload')
export class ScopesPayload extends PaginatedResponse(Scope) {}
