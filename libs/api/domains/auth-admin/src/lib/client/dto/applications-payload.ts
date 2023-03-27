import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { Client } from '../models/client.model'

@ObjectType('AuthAdminApplicationPayload')
export class ApplicationsPayload extends PaginatedResponse(Client) {}
