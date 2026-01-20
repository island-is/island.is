import { Inject, Injectable } from '@nestjs/common'

import { Auth, withAuthContext } from '@island.is/auth-nest-tools'
import { data } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  DispensationHistoryDto,
  DispensationHistoryItemDto,
  OrganDonorDto,
  OrganDto,
  PrescribedItemDto,
  PrescriptionRenewalRequestDto,
  ProductDocumentDto,
  ReferralDto,
  UpdateOrganDonorDto,
  WaitingListEntryDto,
  donationExceptionControllerGetOrgansV1,
  meAppointmentControllerGetPatientAppointmentsV1,
  meDonorStatusControllerGetOrganDonorStatusV1,
  meDonorStatusControllerUpdateOrganDonorStatusV1,
  mePatientConcentEuControllerCreateEuPatientConsentForPatientV1,
  mePatientConcentEuControllerDeactivateEuPatientConsentForPatientV1,
  mePatientConcentEuControllerGetCountriesV1,
  mePatientConcentEuControllerGetEuPatientConsentForPatientV1,
  mePatientConcentEuControllerGetEuPatientConsentV1,
  mePrescriptionCommissionControllerCreateOrUpdatePrescriptionCommissionV1,
  mePrescriptionCommissionControllerGetPrescriptionCommissionsV1,
  mePrescriptionControllerGetPrescribedItemDocumentsV1,
  mePrescriptionControllerGetPrescriptionsV1,
  mePrescriptionControllerRenewPrescriptionV1,
  mePrescriptionDispensationControllerGetDispensationsForAtcCodeV1,
  mePrescriptionDispensationControllerGetGroupedDispensationsV1,
  meReferralControllerGetReferralsV1,
  meWaitingListControllerGetWaitingListEntriesV1,
  questionnaireControllerGetAllQuestionnairesV1,
  questionnaireControllerGetQuestionnaireDetailV1,
  questionnaireControllerGetQuestionnaireSubmissionV1,
  questionnaireControllerSubmitQuestionnaireV1,
} from './gen/fetch'

import {
  AppointmentDto,
  ConsentCountryDto,
  CreateEuPatientConsentDto,
  CreateOrUpdatePrescriptionCommissionDto,
  EuPatientConsentDto,
  EuPatientConsentStatus,
  Locale,
  PrescriptionCommissionDto,
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
  QuestionnaireSubmissionDetailDto,
  SubmitQuestionnaireDto,
  UserVisibleAppointmentStatuses,
} from './gen/fetch/types.gen'

@Injectable()
export class HealthDirectorateHealthService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger = logger.child({ context: 'HealthDirectorateHealthService' })
  }

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
      data(
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
      data(
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
      data(
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
    return await withAuthContext(auth, () =>
      data(
        mePrescriptionControllerRenewPrescriptionV1({
          path: {
            id,
          },
          body: input,
        }),
      ),
    )
  }

  /* Fylgiseðill */
  public async getPrescriptionDocuments(
    auth: Auth,
    productId: string,
  ): Promise<ProductDocumentDto[] | null> {
    const pdf = await withAuthContext(auth, () =>
      data(
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
      data(
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
      data(
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
      data(
        meDonorStatusControllerGetOrganDonorStatusV1({
          query: {
            locale: this.mapLocale(input),
          },
        }),
      ),
    )

    if (!organDonation) {
      this.logger.debug('No organ donations data returned')
      return null
    }

    return organDonation
  }

  public async updateOrganDonation(
    auth: Auth,
    input: UpdateOrganDonorDto,
    locale: Locale,
  ): Promise<void> {
    await withAuthContext(auth, () =>
      data(
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
      data(
        donationExceptionControllerGetOrgansV1({
          query: {
            locale: this.mapLocale(input),
          },
        }),
      ),
    )

    if (!donationExceptions) {
      this.logger.debug('No organ donations exceptions returned')
      return null
    }

    return donationExceptions
  }

  public async getQuestionnaires(
    auth: Auth,
    locale: Locale,
  ): Promise<QuestionnaireBaseDto[] | null> {
    const questionnaires = await withAuthContext(auth, () =>
      data(questionnaireControllerGetAllQuestionnairesV1()),
    )

    if (!questionnaires) {
      this.logger.debug(`No questionnaires data returned for locale ${locale}`)
      return null
    }

    return questionnaires
  }

  public async getQuestionnaire(
    auth: Auth,
    locale: Locale,
    id: string,
  ): Promise<QuestionnaireDetailDto | null> {
    const questionnaire = await withAuthContext(auth, () =>
      data(
        questionnaireControllerGetQuestionnaireDetailV1({
          path: {
            id: id,
          },
        }),
      ),
    )

    if (!questionnaire) {
      this.logger.debug('No questionnaire data returned')
      return null
    }

    return questionnaire
  }

  public async getQuestionnaireAnswered(
    auth: Auth,
    locale: Locale,
    id: string,
    submissionId: string,
  ): Promise<QuestionnaireSubmissionDetailDto | null> {
    try {
      this.logger.debug(`Fetching answered questionnaire`, { id, submissionId })

      const questionnaires = await withAuthContext(auth, () =>
        data(
          questionnaireControllerGetQuestionnaireSubmissionV1({
            path: {
              id,
              submissionId,
            },
          }),
        ),
      )

      if (!questionnaires) {
        this.logger.debug('No answered questionnaire data returned', {
          id,
          submissionId,
        })
        return null
      }

      // Ensure the response is an array
      if (!Array.isArray(questionnaires)) {
        this.logger.warn(
          'Unexpected response format for getQuestionnaireAnswered',
        )
      }

      return questionnaires
    } catch (error) {
      this.logger.error(`Error fetching questionnaire answered data`, {
        id,
        submissionId,
        error,
      })
      return null
    }
  }

  public async submitQuestionnaire(
    auth: Auth,
    locale: Locale,
    id: string,
    input: SubmitQuestionnaireDto,
  ): Promise<string | null> {
    const submission = await withAuthContext(auth, () =>
      data(
        questionnaireControllerSubmitQuestionnaireV1({
          path: {
            id: id,
          },
          body: input,
        }),
      ),
    )

    if (!submission) {
      this.logger.debug('No questionnaire submission data returned')
      return null
    }

    return submission
  }

  /** Medicine Delegation */

  public async getMedicineDelegations(
    auth: Auth,
    locale: Locale,
    status: string[],
  ): Promise<Array<PrescriptionCommissionDto> | null> {
    const medicineDelegations = await withAuthContext(auth, () =>
      data(
        mePrescriptionCommissionControllerGetPrescriptionCommissionsV1({
          query: {
            status: status,
          },
        }),
      ),
    )
    if (!medicineDelegations) {
      return null
    }

    return medicineDelegations
  }

  public async putMedicineDelegation(
    auth: Auth,
    input: CreateOrUpdatePrescriptionCommissionDto,
  ) {
    return await withAuthContext(auth, () =>
      data(
        mePrescriptionCommissionControllerCreateOrUpdatePrescriptionCommissionV1(
          {
            body: input,
          },
        ),
      ),
    )
  }

  /* Patient Data Permits */

  public async getPermits(
    auth: Auth,
    locale: Locale,
    status: EuPatientConsentStatus[],
    dateFrom?: Date | undefined,
    dateTo?: Date | undefined,
  ): Promise<EuPatientConsentDto[] | null> {
    const permits = await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerGetEuPatientConsentForPatientV1({
          query: {
            locale: this.mapLocale(locale),
            status: status,
            validFrom: dateFrom ?? undefined,
            validTo: dateTo ?? undefined,
          },
        }),
      ),
    )

    return permits ?? null
  }

  public async getPermit(
    auth: Auth,
    locale: Locale,
    id: string,
  ): Promise<EuPatientConsentDto | null> {
    const permit = await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerGetEuPatientConsentV1({
          query: {
            locale: this.mapLocale(locale),
          },
          path: {
            id: id,
          },
        }),
      ),
    )

    return permit ?? null
  }

  public async getPermitCountries(
    auth: Auth,
    locale: Locale,
  ): Promise<ConsentCountryDto[] | null> {
    const countries = await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerGetCountriesV1({
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )

    if (!countries) {
      return null
    }

    // Convert object with numeric keys to array
    if (typeof countries === 'object' && !Array.isArray(countries)) {
      return Object.values(
        countries as unknown as Record<string, ConsentCountryDto>,
      )
    }

    // If it's already an array, return as is
    if (Array.isArray(countries)) {
      return countries
    }

    return null
  }

  public async createPermit(
    auth: Auth,
    input: CreateEuPatientConsentDto,
  ): Promise<unknown> {
    return await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerCreateEuPatientConsentForPatientV1({
          body: input,
        }),
      ),
    )
  }

  public async deactivatePermit(auth: Auth, id: string): Promise<unknown> {
    return await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerDeactivateEuPatientConsentForPatientV1({
          path: {
            id: id,
          },
        }),
      ),
    )
  }

  /* Appointments */
  public async getAppointments(
    auth: Auth,
    from?: Date,
    statuses?: UserVisibleAppointmentStatuses[],
  ): Promise<AppointmentDto[] | null> {
    const defaultFrom = new Date()

    const appointments = await withAuthContext(auth, () =>
      data(
        meAppointmentControllerGetPatientAppointmentsV1({
          query: {
            fromStartTime: from ?? defaultFrom,
            status: statuses,
          },
        }),
      ),
    )

    return appointments ?? null
  }
}
