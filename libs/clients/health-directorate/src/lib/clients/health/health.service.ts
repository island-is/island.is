import { AuthMiddleware, Auth } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import {
  MeReferralsApi,
  MeWaitingListsApi,
  MeDispensationsApi,
  ReferralDto,
  Locale,
  DispensationDto,
  WaitingListEntryDto,
} from './gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOG_CATEGORY = 'health-directorate-health-api'

@Injectable()
export class HealthDirectorateHealthService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly referralsApi: MeReferralsApi,
    private readonly waitingListsApi: MeWaitingListsApi,
    private readonly dispensationsApi: MeDispensationsApi,
  ) {}

  private referralsApiWithAuth(auth: Auth) {
    return this.referralsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private waitingListsApiWithAuth(auth: Auth) {
    return this.waitingListsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private dispensationsApiWithAuth(auth: Auth) {
    return this.dispensationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mapLocale(locale: string): Locale {
    return locale === 'is' ? Locale.Is : Locale.En
  }

  /* Afgreiðslur */
  private async getDispensations(
    auth: Auth,
    atcCode: string,
  ): Promise<Array<DispensationDto> | null> {
    const dispensations = await this.dispensationsApiWithAuth(auth)
      .meDispensationControllerGetDispensationsForAtcCodeV1({ atcCode })
      .catch(handle404)

    if (!dispensations) {
      this.logger.debug(`No dispensations returned for atc code: ${atcCode}`, {
        category: LOG_CATEGORY,
      })
      return null
    }

    return dispensations
  }

  /* Tilvísanir */
  public async getReferrals(
    auth: Auth,
    locale: string,
  ): Promise<Array<ReferralDto> | null> {
    const referrals: ReferralDto[] = [
      {
        id: '1',
        serviceType: 'Þjálfun (serviceType)', // not used
        serviceName: 'Sjúkraþjálfun',
        createdDate: new Date(),
        validUntilDate: new Date(),
        stateValue: 1, // not used
        stateDisplay: 'Virk tilvísun',
        assignedProviderId: '1', // not used
        reasonForReferral: 'Meiðsli á hné',
        fromContactInfo: {
          name: 'Jón Jónsson',
          profession: 'Heimilislæknir',
          department: 'Heilsugæslan Miðbæ',
        },
        toContactInfo: {
          name: 'Opin tilvísun',
          profession: '',
          department: '',
        },
      },
      {
        id: '2',
        serviceType: 'Ofnæmi (serviceType)', // not used
        serviceName: 'Ofnæmislæknir',
        createdDate: new Date(),
        validUntilDate: new Date(),
        stateValue: 1, // not used
        stateDisplay: 'Óvirk tilvísun',
        assignedProviderId: '1', // not used
        reasonForReferral: 'Ofnæmisviðbrögð í húð',
        fromContactInfo: {
          name: 'Jón Jónsson',
          profession: 'Heimilislæknir',
          department: 'Heilsugæslan Miðbæ',
        },
        toContactInfo: {
          name: 'Sigurður Kjartansson',
          profession: 'Ofnæmislækningar',
          department: 'Domus barnalæknar',
        },
      },
    ]

    // await this.referralsApiWithAuth(auth)
    //   .meReferralControllerGetReferralsV1({ locale: this.mapLocale(locale) })
    //   .catch(handle404)

    if (!referrals) {
      this.logger.debug('No referrals returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return referrals
  }

  /* Biðlistar */
  public async getWaitlists(
    auth: Auth,
    locale: string,
  ): Promise<Array<WaitingListEntryDto> | null> {
    const waitlists: WaitingListEntryDto[] = [
      {
        id: '1',
        name: 'Liðskiptaaðgerð á hné',
        organizationName: 'Landspítalinn' as unknown as object,
        statusDisplay: 'Samþykktur á lista' as unknown as object,
        statusId: '1' as unknown as object,
        lastUpdated: '23.11.2023' as unknown as object,
        waitBeganDate: '08.10.2023' as unknown as object,
      },
      {
        id: '2',
        name: 'Hjúkrunarheimili',
        organizationName: 'Sóltún hjúkrunarheimili' as unknown as object,
        statusDisplay: 'Umsókn í vinnslu' as unknown as object,
        statusId: '2' as unknown as object,
        lastUpdated: '12.09.2024' as unknown as object,
        waitBeganDate: '01.02.2022' as unknown as object,
      },
    ]

    // await this.waitingListsApiWithAuth(auth)
    //   .meWaitingListControllerGetWaitingListEntriesV1({
    //     locale: this.mapLocale(locale),
    //   })
    //   .catch(handle404)

    if (!waitlists) {
      this.logger.debug('No waitlists returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return waitlists
  }
}
