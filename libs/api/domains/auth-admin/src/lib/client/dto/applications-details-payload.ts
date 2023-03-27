import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { ApplicationDetails } from '../models/application-details.model'

@ObjectType('AuthAdminApplicationDetailsPayload')
export class ApplicationsDetailsPayload extends PaginatedResponse(
  ApplicationDetails,
) {}
