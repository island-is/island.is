import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { SocialInsuranceAdministrationGeneralApplicationService } from './generalApplication.service'
import { OldAgePensionApplicationType } from '../../types'
import { OAP_APPLICATION_TYPES } from '../../constants'
import { OldAgePensionDTO } from '../../dto/oldAgePension.dto'

@Injectable()
export class SocialInsuranceAdministrationOldAgePensionService {
  constructor(
    private readonly applicationService: SocialInsuranceAdministrationGeneralApplicationService,
  ) {}

  async sendOldAgePensionApplication(
    user: User,
    input: OldAgePensionDTO,
    pensionType: OldAgePensionApplicationType,
  ): Promise<void> {
    return this.applicationService.sendApplicationV2(
      user,
      input,
      OAP_APPLICATION_TYPES[pensionType],
    )
  }
}
