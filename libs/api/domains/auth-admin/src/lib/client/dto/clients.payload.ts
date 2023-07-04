import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { Client } from '../models/client.model'

@ObjectType('AuthAdminClientsPayload')
export class ClientsPayload extends PaginatedResponse(Client) {}
