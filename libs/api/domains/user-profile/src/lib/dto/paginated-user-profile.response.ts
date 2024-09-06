import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'
import { AdminUserProfile } from '../adminUserProfile.model'

@ObjectType('UserProfileAdminProfilesResponse')
export class PaginatedUserProfileResponse extends PaginatedResponse(
  AdminUserProfile,
) {}
