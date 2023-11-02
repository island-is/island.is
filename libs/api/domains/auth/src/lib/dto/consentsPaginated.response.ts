import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { Consent } from '../models/consent.model'

@ObjectType('AuthConsentsPaginated')
export class ConsentsPaginated extends PaginatedResponse(Consent) {}
