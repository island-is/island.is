import { CurrentAuth, CurrentUser, User } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Request, UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { UserAdviceResult } from '../models/userAdviceResult.model'
import { CurrentAuthorization } from '../auth-tools/current-authorization'
import { UserAdviceResultService } from './userAdvice.services'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class UserAdviceResultResolver {
  constructor(private userAdviceResultService: UserAdviceResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => [UserAdviceResult], { name: 'consultationPortalAllUserAdvices' })
  async getAllUserAdvices(
    @CurrentAuthorization() authString: string,
  ): Promise<UserAdviceResult[]> {
    const userAdvices = await this.userAdviceResultService.getAllUserAdvices(
      authString,
    )
    return userAdvices
  }
}
