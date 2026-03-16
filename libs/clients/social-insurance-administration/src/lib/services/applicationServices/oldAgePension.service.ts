import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApplicationApi as ApplicationWriteApiV2 } from '../../../../gen/fetch/v2'
import { OldAgePensionDTO } from '../../..'
import { OldAgePensionApplicationType } from '../../types'
import { OAP_APPLICATION_TYPES } from '../../constants'

@Injectable()
export class SocialInsuranceAdministrationOldAgePensionService {
  constructor(private readonly applicationWriteApiV2: ApplicationWriteApiV2) {}

  private applicationWriteApiV2WithAuth = (user: User) =>
    this.applicationWriteApiV2.withMiddleware(new AuthMiddleware(user as Auth))

  async sendOldAgePensionApplication(
    user: User,
    input: OldAgePensionDTO,
    pensionType: OldAgePensionApplicationType,
  ): Promise<void> {
    return this.applicationWriteApiV2WithAuth(
      user,
    ).apiProtectedV2ApplicationApplicationTypePost({
      applicationType: OAP_APPLICATION_TYPES[pensionType],
      body: input,
    })
  }
}
