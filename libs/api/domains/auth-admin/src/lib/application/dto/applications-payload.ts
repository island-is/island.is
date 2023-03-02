import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { Application } from '../models/application.model'

@ObjectType('AuthAdminApplicationPayload')
export class ApplicationsPayload extends PaginatedResponse(Application) {}
