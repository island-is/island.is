import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { CurrentAuthorization } from '../auth-tools/current-authorization'
import { UserDataResultService } from './userData.services'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'
import { UserSubscriptionsAggregate } from '../models/userSubscriptionsAggregate.model'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class UserDataResultResolver {
  constructor(private userDataResultService: UserDataResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => UserAdviceAggregate, {
    name: 'consultationPortalAllUserAdvices',
  })
  async getAllUserAdvices(
    @CurrentAuthorization() authString: string,
    @Args('input', { type: () => GetUserAdvicesInput })
    input: GetUserAdvicesInput,
  ): Promise<UserAdviceAggregate> {
    const userAdvices = await this.userDataResultService.getAllUserAdvices(
      authString,
      input,
    )
    return userAdvices
  }
  // async getUserSubscriptions(): Promise<UserSubscriptionsAggregate> {
  //   const response = await this.userAdviceResultService
  // }
}
