import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { CurrentAuthorization } from '../auth-tools/current-authorization'
import { UserAdviceResultService } from './userAdvice.services'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class UserAdviceResultResolver {
  constructor(private userAdviceResultService: UserAdviceResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => UserAdviceAggregate, {
    name: 'consultationPortalAllUserAdvices',
  })
  async getAllUserAdvices(
    @CurrentAuthorization() authString: string,
    @Args('input', { type: () => GetUserAdvicesInput })
    input: GetUserAdvicesInput,
  ): Promise<UserAdviceAggregate> {
    const userAdvices = await this.userAdviceResultService.getAllUserAdvices(
      authString,
      input,
    )
    return userAdvices
  }
}
