import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'
import { UserProfile } from '../userProfile.model'

@ObjectType('UserProfilePaginatedResponse')
export class PaginatedUserProfileResponse extends PaginatedResponse(
  UserProfile,
) {}
