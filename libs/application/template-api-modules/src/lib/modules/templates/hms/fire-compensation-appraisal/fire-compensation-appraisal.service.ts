import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import { Fasteign } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

@Injectable()
export class FireCompensationAppraisalService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.FIRE_COMPENSATION_APPRAISAL)
  }

  mockGetProperties(): Array<Fasteign> {
    return [
      {
        fasteignanumer: 'F12345',
        sjalfgefidStadfang: {
          stadfanganumer: 1234,
          landeignarnumer: 567,
          postnumer: 113,
          sveitarfelagBirting: 'Reykjavík',
          birting: 'Vesturhóp 34, 240 Grindavík',
          birtingStutt: 'Vesturhóp 34',
        },
        fasteignamat: {
          gildandiFasteignamat: 50000000,
          fyrirhugadFasteignamat: 55000000,
          gildandiMannvirkjamat: 30000000,
          fyrirhugadMannvirkjamat: 35000000,
          gildandiLodarhlutamat: 20000000,
          fyrirhugadLodarhlutamat: 25000000,
          gildandiAr: 2024,
          fyrirhugadAr: 2025,
        },
        landeign: {
          landeignarnumer: '123456',
          lodamat: 75000000,
          notkunBirting: 'Íbúðarhúsalóð',
          flatarmal: '300000',
          flatarmalEining: 'm²',
        },
        thinglystirEigendur: {
          thinglystirEigendur: [
            {
              nafn: 'Gervimaður Danmörk',
              kennitala: '0101302479',
              eignarhlutfall: 0.5,
              kaupdagur: new Date(),
              heimildBirting: 'Afsal',
            },
            {
              nafn: 'Gervimaður Færeyjar',
              kennitala: '0101302399',
              eignarhlutfall: 0.5,
              kaupdagur: new Date(),
              heimildBirting: 'Afsal',
            },
          ],
        },
        notkunareiningar: {
          notkunareiningar: [
            {
              birtStaerdMaelieining: 'm²',
              notkunareininganumer: '010101',
              fasteignanumer: 'F12345',
              stadfang: {
                birtingStutt: 'RVK',
                birting: 'Reykjavík',
                landeignarnumer: 1234,
                sveitarfelagBirting: 'Reykjavík',
                postnumer: 113,
                stadfanganumer: 1234,
              },
              merking: 'SomeValue',
              notkunBirting: 'SomeUsage',
              skyring: 'SomeDescription',
              byggingararBirting: 'SomeYear',
              birtStaerd: 100,
              fasteignamat: {
                gildandiFasteignamat: 50000000,
                fyrirhugadFasteignamat: 55000000,
                gildandiMannvirkjamat: 30000000,
                fyrirhugadMannvirkjamat: 35000000,
                gildandiLodarhlutamat: 20000000,
                fyrirhugadLodarhlutamat: 25000000,
                gildandiAr: 2024,
                fyrirhugadAr: 2025,
              },
              brunabotamat: 100000000,
            },
          ],
        },
      },
    ]
  }

  async getProperties({ application, auth }: TemplateApiModuleActionProps) {
    let properties: Array<Fasteign> = []

    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      properties = this.mockGetProperties()
    }

    // Todo: implement the prod call here

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
