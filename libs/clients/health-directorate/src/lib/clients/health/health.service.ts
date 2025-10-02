import { Auth, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  DispensationHistoryDto,
  DispensationHistoryItemDto,
  PrescribedItemDto,
  PrescriptionRenewalRequestDto,
  ProductDocumentDto,
  ReferralDto,
  OrganDonorDto,
  UpdateOrganDonorDto,
  OrganDto,
  WaitingListEntryDto,
  mePrescriptionControllerGetPrescriptionsV1,
  mePrescriptionControllerGetPrescribedItemDocumentsV1,
  mePrescriptionControllerRenewPrescriptionV1,
  mePrescriptionDispensationControllerGetDispensationsForAtcCodeV1,
  mePrescriptionDispensationControllerGetGroupedDispensationsV1,
  meReferralControllerGetReferralsV1,
  meWaitingListControllerGetWaitingListEntriesV1,
  meDonorStatusControllerGetOrganDonorStatusV1,
  donationExceptionControllerGetOrgansV1,
  meDonorStatusControllerUpdateOrganDonorStatusV1,
} from './gen/fetch'

const LOG_CATEGORY = 'health-directorate-health-api'

import { Locale } from './gen/fetch/types.gen'

@Injectable()
export class HealthDirectorateHealthService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  private mapLocale(locale: string): Locale {
    return locale === 'is' ? Locale.IS : Locale.EN
  }

  /* Dispensations */
  public async getDispensations(
    auth: Auth,
    atcCode: string,
    locale: string,
  ): Promise<Array<DispensationHistoryItemDto> | null> {
    const dispensations = await withAuthContext(auth, () =>
      dataOr404Null(
        mePrescriptionDispensationControllerGetDispensationsForAtcCodeV1({
          path: {
            atcCode,
          },
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )

    if (!dispensations) {
      return null
    }

    return dispensations
  }

  public async getGroupedDispensations(
    auth: Auth,
    locale: string,
  ): Promise<Array<DispensationHistoryDto> | null> {
    const dispensations = await withAuthContext(auth, () =>
      dataOr404Null(
        mePrescriptionDispensationControllerGetGroupedDispensationsV1({
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )

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
    const prescriptions = await withAuthContext(auth, () =>
      dataOr404Null(
        mePrescriptionControllerGetPrescriptionsV1({
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )

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
    return await dataOr404Null(
      mePrescriptionControllerRenewPrescriptionV1({
        path: {
          id,
        },
        body: input,
      }),
    )
  }

  /* Fylgiseðill */
  public async getPrescriptionDocuments(
    auth: Auth,
    productId: string,
  ): Promise<ProductDocumentDto[] | null> {
    const pdf = await withAuthContext(auth, () =>
      dataOr404Null(
        mePrescriptionControllerGetPrescribedItemDocumentsV1({
          path: {
            productId,
          },
        }),
      ),
    )

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
    const referrals = await withAuthContext(auth, () =>
      dataOr404Null(
        meReferralControllerGetReferralsV1({
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )

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
    const waitlists = await withAuthContext(auth, () =>
      dataOr404Null(
        meWaitingListControllerGetWaitingListEntriesV1({
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )

    if (!waitlists) {
      return null
    }

    return waitlists
  }

  public async getOrganDonation(
    auth: Auth,
    input: Locale,
  ): Promise<OrganDonorDto | null> {
    const organDonation = await withAuthContext(auth, () =>
      dataOr404Null(
        meDonorStatusControllerGetOrganDonorStatusV1({
          query: {
            locale: this.mapLocale(input),
          },
        }),
      ),
    )

    if (!organDonation) {
      this.logger.warn('No organ donations data returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return organDonation
  }

  public async updateOrganDonation(
    auth: Auth,
    input: UpdateOrganDonorDto,
    locale: Locale,
  ): Promise<void> {
    console.log('updateOrganDonation', JSON.stringify(input, null, 2))
    await withAuthContext(auth, () =>
      dataOr404Null(
        meDonorStatusControllerUpdateOrganDonorStatusV1({
          body: input,
          query: {
            locale: locale,
          },
        }),
      ),
    )
  }

  public async getDonationExceptions(
    auth: Auth,
    input: Locale,
  ): Promise<Array<OrganDto> | null> {
    const donationExceptions = await withAuthContext(auth, () =>
      dataOr404Null(
        donationExceptionControllerGetOrgansV1({
          query: {
            locale: this.mapLocale(input),
          },
        }),
      ),
    )
    if (!donationExceptions) {
      this.logger.warn('No organ donations exceptions returned', {
        category: LOG_CATEGORY,
      })
      return null
    }

    return donationExceptions
  }
}
