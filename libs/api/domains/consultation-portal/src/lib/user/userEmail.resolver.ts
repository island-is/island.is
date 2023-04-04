import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { UserEmailResultService } from './userEmail.services'
import { UserEmailResult } from '../models/userEmailResult.model'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import { ConsultationPortalScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'

@Resolver()
@UseGuards(FeatureFlagGuard, IdsUserGuard)
@Scopes(ConsultationPortalScope.default)
export class UserEmailResultResolver {
  constructor(private userEmailResultService: UserEmailResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => UserEmailResult, {
    name: 'consultationPortalUserEmail',
  })
  
  async getUserEmail(@CurrentUser() user: User): Promise<UserEmailResult> {
    const userEmail = await this.userEmailResultService.getUserEmail(user)

    return userEmail
  }
}
