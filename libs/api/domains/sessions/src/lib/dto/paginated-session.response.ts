import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { Session } from '../models/session.model'

@ObjectType('SessionsPaginatedSessionResponse')
export class PaginatedSessionResponse extends PaginatedResponse(Session) {}
