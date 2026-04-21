import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DeathBenefitsApi,
  TrWebApiServicesUseCaseDeathBenefitsModelsExternalSpousalInfo,
} from '../../../gen/fetch/v1'

@Injectable()
export class SocialInsuranceAdministrationDeathBenefitsService {
  constructor(private readonly deathBenefitsApi: DeathBenefitsApi) {}

  private deathBenefitsApiWithAuth = (user: User) =>
    this.deathBenefitsApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getSpousalInfo(
    user: User,
  ): Promise<TrWebApiServicesUseCaseDeathBenefitsModelsExternalSpousalInfo> {
    return this.deathBenefitsApiWithAuth(
      user,
    ).apiProtectedV1DeathBenefitsSpousalinfoGet()
  }
}
