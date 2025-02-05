import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  DispensationDto,
  Locale,
  PrescriptionsApi,
  ReferralsApi,
  WaitingListsApi,
  PrescribedItemDto,
  ReferralDto,
  WaitingListEntryDto,
} from './gen/fetch'

const LOG_CATEGORY = 'health-directorate-health-api'

@Injectable()
export class HealthDirectorateHealthService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly referralsApi: ReferralsApi,
    private readonly waitingListsApi: WaitingListsApi,
    private readonly prescriptionsApi: PrescriptionsApi,
  ) {}

  private referralsApiWithAuth(auth: Auth) {
    return this.referralsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private waitingListsApiWithAuth(auth: Auth) {
    return this.waitingListsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private prescriptionsApiWithAuth(auth: Auth) {
    return this.prescriptionsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mapLocale(locale: string): Locale {
    return locale === 'is' ? Locale.Is : Locale.En
  }

  /* Afgreiðslur */
  private async getDispensations(
    auth: Auth,
    atcCode: string,
  ): Promise<Array<DispensationDto> | null> {
    const dispensations = await this.prescriptionsApiWithAuth(auth)
      .meDispensationControllerGetDispensationsForAtcCodeV1({ atcCode })
      .catch(handle404)

    if (!dispensations) {
      this.logger.debug(
        `No prescription dispensations returned for atc code: ${atcCode}`,
        {
          category: LOG_CATEGORY,
        },
      )
      return null
    }

    return dispensations
  }

  private async getGroupedDispensations(
    auth: Auth,
  ): Promise<Array<DispensationDto> | null> {
    const dispensations = await this.prescriptionsApiWithAuth(auth)
      .meDispensationControllerGetGroupedDispensationsV1()
      .catch(handle404)

    if (!dispensations) {
      this.logger.debug(`No prescription dispensations grouped returned`, {
        category: LOG_CATEGORY,
      })
      return null
    }

    return dispensations
  }

  /* Lyfseðlar */
  public async getPrescriptions(
    auth: Auth,
    locale: string,
  ): Promise<Array<PrescribedItemDto> | null> {
    const prescriptions = await this.prescriptionsApiWithAuth(
      auth,
    ).mePrescriptionControllerGetPrescriptionsV1({
      locale: this.mapLocale(locale),
    })

    if (!prescriptions) {
      this.logger.debug('No prescriptions returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return prescriptions
  }

  /* Tilvísanir */
  public async getReferrals(
    auth: Auth,
    locale: string,
  ): Promise<Array<ReferralDto> | null> {
    const referrals = await this.referralsApiWithAuth(auth)
      .meReferralControllerGetReferralsV1({ locale: this.mapLocale(locale) })
      .catch(handle404)

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
    const waitlists = await this.waitingListsApiWithAuth(auth)
      .meWaitingListControllerGetWaitingListEntriesV1({
        locale: this.mapLocale(locale),
      })
      .catch(handle404)

    if (!waitlists) {
      this.logger.debug('No waitlists returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return waitlists
  }
}
