import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  DispensationHistoryDto,
  DispensationHistoryItemDto,
  Locale,
  PrescribedItemDto,
  PrescriptionRenewalRequestDto,
  PrescriptionsApi,
  ProductDocumentDto,
  ReferralDto,
  ReferralsApi,
  WaitingListEntryDto,
  WaitingListsApi,
} from './gen/fetch'

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
  public async getDispensations(
    auth: Auth,
    atcCode: string,
    locale: string,
  ): Promise<Array<DispensationHistoryItemDto> | null> {
    const dispensations = await this.prescriptionsApiWithAuth(auth)
      .mePrescriptionDispensationControllerGetDispensationsForAtcCodeV1({
        atcCode,
        locale: this.mapLocale(locale),
      })
      .catch(handle404)

    if (!dispensations) {
      return null
    }

    return dispensations
  }

  public async getGroupedDispensations(
    auth: Auth,
    locale: string,
  ): Promise<Array<DispensationHistoryDto> | null> {
    const dispensations = await this.prescriptionsApiWithAuth(auth)
      .mePrescriptionDispensationControllerGetGroupedDispensationsV1({
        locale: this.mapLocale(locale),
      })
      .catch(handle404)

    if (!dispensations) {
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
      return null
    }

    return prescriptions
  }

  /* Endurnýjun lyfseðils */
  public async postRenewalPrescription(
    auth: Auth,
    id: string,
    input: PrescriptionRenewalRequestDto,
  ) {
    return await this.prescriptionsApiWithAuth(
      auth,
    ).mePrescriptionControllerRenewPrescriptionV1({
      id,
      prescriptionRenewalRequestDto: input,
    })
  }

  /* Fylgiseðill */
  public async getPrescriptionDocuments(
    auth: Auth,
    productId: string,
  ): Promise<ProductDocumentDto[] | null> {
    const pdf = await this.prescriptionsApiWithAuth(auth)
      .mePrescriptionControllerGetPrescribedItemDocumentsV1({
        productId: productId,
      })
      .catch(handle404)

    if (!pdf) {
      return null
    }

    return pdf
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
      return null
    }

    return waitlists
  }
}
