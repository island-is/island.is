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
  ProductDocumentDto,
  ReferralDto,
  UpdateOrganDonorDto,
  WaitingListEntryDto,
  donationExceptionControllerGetOrgansV1,
  meAppointmentControllerGetPatientAppointmentsV1,
  meAppointmentControllerGetPatientAppointmentByIdV1,
  meConversationControllerArchiveConversationV1,
  meConversationControllerCreateConversationV1,
  meConversationControllerGetConversationByIdV1,
  meConversationControllerGetConversationsV1,
  meConversationControllerGetMessageAttachmentV1,
  meConversationControllerMarkConversationAsReadV1,
  meConversationControllerReplyToConversationV1,
  meConversationControllerStarConversationV1,
  meConversationControllerUnarchiveConversationV1,
  meConversationControllerUnstarConversationV1,
  meMessagingRecipientControllerGetMessagingRecipientsV1,
  meDonorStatusControllerGetOrganDonorStatusV1,
  meDonorStatusControllerUpdateOrganDonorStatusV1,
  mePatientConcentEuControllerCreateEuPatientConsentForPatientV1,
  mePatientConcentEuControllerDeactivateEuPatientConsentForPatientV1,
  mePatientConcentEuControllerGetCountriesV1,
  mePatientConcentEuControllerGetEuPatientConsentForPatientV1,
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
  AppointmentBaseDto,
  AppointmentDetailDto,
  ConsentCountryDto,
  ConversationBaseDto,
  ConversationDetailDto,
  ConversationStatusFilter,
  CreateConversationRequestDto,
  CreateEuPatientConsentDto,
  CreateOrUpdatePrescriptionCommissionDto,
  CreateReplyRequestDto,
  EuPatientConsentResponseDto,
  Locale,
  MessagingRecipientDto,
  PrescriptionCommissionDto,
  QuestionnaireBaseDto,
  QuestionnaireDetailDto,
  QuestionnaireSubmissionDetailDto,
  SubmitQuestionnaireDto,
  SubmitQuestionnaireResponseDto,
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
  public async postRenewalPrescription(auth: Auth, id: string) {
    return await withAuthContext(auth, () =>
      data(
        mePrescriptionControllerRenewPrescriptionV1({
          path: {
            id,
          },
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
    locale: string,
  ): Promise<OrganDonorDto | null> {
    const organDonation = await withAuthContext(auth, () =>
      data(
        meDonorStatusControllerGetOrganDonorStatusV1({
          query: {
            locale: this.mapLocale(locale),
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
    locale: string,
  ): Promise<void> {
    await withAuthContext(auth, () =>
      data(
        meDonorStatusControllerUpdateOrganDonorStatusV1({
          body: input,
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )
  }

  public async getDonationExceptions(
    auth: Auth,
    locale: string,
  ): Promise<Array<OrganDto> | null> {
    const donationExceptions = await withAuthContext(auth, () =>
      data(
        donationExceptionControllerGetOrgansV1({
          query: {
            locale: this.mapLocale(locale),
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
  ): Promise<SubmitQuestionnaireResponseDto | null> {
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
  ): Promise<EuPatientConsentResponseDto | null> {
    const permits = await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerGetEuPatientConsentForPatientV1({
          query: {
            locale: this.mapLocale(locale),
          },
        }),
      ),
    )

    return permits ?? null
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
  ): Promise<EuPatientConsentResponseDto | null> {
    const result = await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerCreateEuPatientConsentForPatientV1({
          body: input,
        }),
      ),
    )

    return result ?? null
  }

  public async deactivatePermit(auth: Auth): Promise<unknown> {
    return await withAuthContext(auth, () =>
      data(
        mePatientConcentEuControllerDeactivateEuPatientConsentForPatientV1(),
      ),
    )
  }

  /* Appointments */
  public async getAppointments(
    auth: Auth,
    from?: Date,
    statuses?: UserVisibleAppointmentStatuses[],
  ): Promise<AppointmentBaseDto[] | null> {
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

  public async getAppointmentById(
    auth: Auth,
    id: string,
  ): Promise<AppointmentDetailDto | null> {
    const appointment = await withAuthContext(auth, () =>
      data(
        meAppointmentControllerGetPatientAppointmentByIdV1({
          path: { id },
        }),
      ),
    )

    return appointment ?? null
  }

  /* Conversations (Health Messages) */

  public async getConversations(
    auth: Auth,
    status?: ConversationStatusFilter,
    starred?: boolean,
  ): Promise<ConversationBaseDto[] | null> {
    const conversations = await withAuthContext(auth, () =>
      data(
        meConversationControllerGetConversationsV1({
          query: { status, starred },
        }),
      ),
    )

    return conversations ?? null
  }

  public async getConversation(
    auth: Auth,
    id: string,
  ): Promise<ConversationDetailDto | null> {
    const conversation = await withAuthContext(auth, () =>
      data(
        meConversationControllerGetConversationByIdV1({
          path: { id },
        }),
      ),
    )

    return conversation ?? null
  }

  public async createConversation(
    auth: Auth,
    input: CreateConversationRequestDto,
  ): Promise<ConversationDetailDto | null> {
    const conversation = await withAuthContext(auth, () =>
      data(
        meConversationControllerCreateConversationV1({
          body: input,
        }),
      ),
    )

    return conversation ?? null
  }

  public async replyToConversation(
    auth: Auth,
    id: string,
    input: CreateReplyRequestDto,
  ): Promise<ConversationDetailDto | null> {
    const conversation = await withAuthContext(auth, () =>
      data(
        meConversationControllerReplyToConversationV1({
          path: { id },
          body: input,
        }),
      ),
    )

    return conversation ?? null
  }

  public async markConversationAsRead(auth: Auth, id: string): Promise<void> {
    await withAuthContext(auth, () =>
      data(meConversationControllerMarkConversationAsReadV1({ path: { id } })),
    )
  }

  public async archiveConversation(auth: Auth, id: string): Promise<void> {
    await withAuthContext(auth, () =>
      data(meConversationControllerArchiveConversationV1({ path: { id } })),
    )
  }

  public async unarchiveConversation(auth: Auth, id: string): Promise<void> {
    await withAuthContext(auth, () =>
      data(meConversationControllerUnarchiveConversationV1({ path: { id } })),
    )
  }

  public async starConversation(auth: Auth, id: string): Promise<void> {
    await withAuthContext(auth, () =>
      data(meConversationControllerStarConversationV1({ path: { id } })),
    )
  }

  public async unstarConversation(auth: Auth, id: string): Promise<void> {
    await withAuthContext(auth, () =>
      data(meConversationControllerUnstarConversationV1({ path: { id } })),
    )
  }

  public async getMessageAttachment(
    auth: Auth,
    conversationId: string,
    messageId: string,
    attachmentId: number,
  ): Promise<{ data: ArrayBuffer; contentType: string } | null> {
    const result = await withAuthContext(auth, () =>
      meConversationControllerGetMessageAttachmentV1({
        path: { id: conversationId, messageId, attachmentId },
        parseAs: 'arrayBuffer',
      }),
    )
    if (!result.data) return null
    return {
      data: result.data as ArrayBuffer,
      contentType:
        result.response.headers.get('content-type') ??
        'application/octet-stream',
    }
  }

  public async getMessagingRecipients(
    auth: Auth,
    locale?: Locale,
  ): Promise<MessagingRecipientDto[] | null> {
    const recipients = await withAuthContext(auth, () =>
      data(
        meMessagingRecipientControllerGetMessagingRecipientsV1({
          query: { locale },
        }),
      ),
    )

    return recipients ?? null
  }
}
