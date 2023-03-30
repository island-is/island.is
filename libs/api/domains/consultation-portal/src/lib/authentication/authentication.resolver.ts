import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { AuthenticationService } from './authentication.service'

@Resolver()
@UseGuards(FeatureFlagGuard)
export class AuthenticationResolver {
  constructor(private authenticationService: AuthenticationService) {}
  @Query(() => String, { name: 'consultationPortalAuthenticationUrl' })
  @FeatureFlag(Features.consultationPortalApplication)
  async getAuthenticationUrl(): Promise<string> {
    const url = await this.authenticationService.getAuthenticationUrl()
    return url
  }
}
