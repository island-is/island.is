import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'
import { AdminUserProfile } from '../adminUserProfile.model'

@ObjectType('UserProfileAdminUserProfilesResponse')
export class PaginatedUserProfileResponse extends PaginatedResponse(
  AdminUserProfile,
) {}
