import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { UserAdviceResult } from '../models/userAdviceResult.model'
import { UserAdviceResultService } from './userAdvice.services'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class UserAdviceResultResolver {
  constructor(private userAdviceResultService: UserAdviceResultService) {}

  @FeatureFlag(Features.consultationPortalApplication)
  @Query(() => [UserAdviceResult], { name: 'consultationPortalAllUserAdvices' })
  async getAllUserAdvices(): Promise<UserAdviceResult[]> {
    const userAdvices = await this.userAdviceResultService.getAllUserAdvices()
    return userAdvices
  }
}
