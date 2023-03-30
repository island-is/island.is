import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CurrentAuthorization } from '../auth-tools/current-authorization'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { UserEmailResultService } from './userEmail.services'
import { UserEmailResult } from '../models/userEmailResult.model'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class UserEmailResultResolver {
  constructor(private userEmailResultService: UserEmailResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => UserEmailResult, {
    name: 'consultationPortalUserEmail',
  })
  async getUserEmail(
    @CurrentAuthorization() authString: string,
  ): Promise<UserEmailResult> {
    const userEmail = await this.userEmailResultService.getUserEmail(authString)

    return userEmail
  }
}
