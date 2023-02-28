import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { Tenant } from '../models/tenant.model'

@ObjectType('AuthAdminTenantsPayload')
export class TenantsPayload extends PaginatedResponse(Tenant) {}
