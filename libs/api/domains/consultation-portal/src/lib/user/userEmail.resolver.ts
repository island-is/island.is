import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { UserEmailResultService } from './userEmail.services'
import { UserEmailResult } from '../models/userEmailResult.model'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  User,
} from '@island.is/auth-nest-tools'
import { ConsultationPortalScope } from '@island.is/auth/scopes'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class UserEmailResultResolver {
  constructor(private userEmailResultService: UserEmailResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => UserEmailResult, {
    name: 'consultationPortalUserEmail',
  })
  @UseGuards(IdsUserGuard)
  @Scopes(ConsultationPortalScope.default)
  async getUserEmail(@CurrentUser() user: User): Promise<UserEmailResult> {
    const userEmail = await this.userEmailResultService.getUserEmail(user)

    return userEmail
  }
}
