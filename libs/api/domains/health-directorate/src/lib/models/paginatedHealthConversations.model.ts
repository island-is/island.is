import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { HealthDirectorateHealthConversation } from './healthConversation.model'

@ObjectType('HealthDirectoratePaginatedHealthConversations')
export class HealthDirectoratePaginatedHealthConversations extends PaginatedResponse(
  HealthDirectorateHealthConversation,
) {}
