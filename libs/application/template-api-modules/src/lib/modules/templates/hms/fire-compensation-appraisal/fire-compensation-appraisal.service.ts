import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { getMockedFasteign } from './mockedFasteign'

@Injectable()
export class FireCompensationAppraisalService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private propertiesApi: FasteignirApi,
  ) {
    super(ApplicationTypes.FIRE_COMPENSATION_APPRAISAL)
  }

  private getRealEstatesWithAuth(auth: User) {
    return this.propertiesApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  mockGetProperties(): Array<Fasteign> {
    return [
      getMockedFasteign('Vesturhóp 34, 240 Grindavík', 'F12345', [
        {
          notkunBirting: 'Íbúð á hæð',
          brunabotamat: 100000000,
          notkunareininganumer: '010101',
        },
      ]),
      getMockedFasteign('Mosarimi 2, 112 Reykjavík', 'F54321', [
        {
          notkunBirting: 'Íbúðarhúsalóð',
          brunabotamat: 70000000,
          notkunareininganumer: '010102',
        },
        {
          notkunBirting: 'Íbúð í kjallara',
          brunabotamat: 91204000,
          notkunareininganumer: '010103',
        },
      ]),
      getMockedFasteign('Dúfnahólar 10, 105 Reykjavík', 'F98765', [
        {
          notkunBirting: 'Íbúðarhúsalóð',
          brunabotamat: 50000000,
          notkunareininganumer: '010104',
        },
        {
          notkunBirting: 'Fjós',
          brunabotamat: 7300000,
          notkunareininganumer: '010105',
        },
        {
          notkunBirting: 'Skemma',
          brunabotamat: 8600000,
          notkunareininganumer: '010106',
        },
      ]),
    ]
  }

  async getProperties({ auth }: TemplateApiModuleActionProps) {
    let properties: Array<Fasteign> = []

    // Mock for dev, since there is no dev service for the propertiesApi
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      properties = this.mockGetProperties()
    }
    // If on prod we fetch a list of all the fasteignanúmer for kennitala and then
    // fetch each property individually with the full data.
    else {
      const simpleProperties = await this.getRealEstatesWithAuth(
        auth,
      ).fasteignirGetFasteignir({ kennitala: auth.nationalId })

      properties = await Promise.all(
        simpleProperties?.fasteignir?.map((property) => {
          return this.propertiesApi.fasteignirGetFasteign({
            fasteignanumer: property.fasteignanumer ?? '',
          })
        }) ?? [],
      )
    }

    return properties
  }

  async createApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }

  async completeApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}
