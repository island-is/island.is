import { Auth } from '@island.is/auth-nest-tools'
import {
  ConversationAttachmentDto,
  ConversationAttachmentRequestDto,
  ConversationMessageDto,
  ConversationStatusFilter,
  CreateConversationRequestDto,
  CreateEuPatientConsentDto,
  CreateReplyRequestDto,
  HealthDirectorateHealthService,
  HealthDirectorateVaccinationsService,
  OrganDonorDto,
  UserVisibleAppointmentStatuses,
  VaccinationDto,
} from '@island.is/clients/health-directorate'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import sortBy from 'lodash/sortBy'
import { PATIENT_PERMIT_CODE } from './constants'
import {
  HealthDirectorateAppointmentInput,
  HealthDirectorateAppointmentsInput,
} from './dto/appointments.input'
import { HealthDirectorateCreateMessageInput } from './dto/createHealthMessage.input'
import { HealthDirectorateReplyToMessageInput } from './dto/replyToHealthMessage.input'
import {
  MedicineDelegationCreateOrDeleteInput,
  MedicineDelegationInput,
} from './dto/medicineDelegation.input'
import { PermitInput } from './dto/permit.input'
import { HealthDirectorateResponse } from './dto/response.dto'
import {
  mapAppointmentStatus,
  toAppointmentStatusEnum,
  mapStatusIdToColor,
  mapReferralStatusValueToStatus,
  mapVaccinationStatus,
} from './mappers/basicInformationMapper'
import {
  mapDelegationStatus,
  mapDispensationItem,
  mapPrescriptionCategory,
  mapPrescriptionRenewalBlockedReason,
  mapPrescriptionRenewalStatus,
} from './mappers/medicineMapper'
import { mapPermit, mapPermitHistoryEntry } from './mappers/patientDataMapper'
import { Appointment, Appointments } from './models/appointments.model'
import { AppointmentDetail } from './models/appointmentDetail.model'
import { PermitStatusEnum } from './models/enums'
import { MedicineDelegations } from './models/medicineDelegation.model'
import {
  MedicineHistory,
  MedicineHistoryDispensation,
  MedicineHistoryItem,
} from './models/medicineHistory.model'
import { MedicineDispensationsATCInput } from './models/medicineHistoryATC.dto'
import { MedicineDispensationsATC } from './models/medicineHistoryATC.model'
import { Donor, DonorInput, Organ } from './models/organ-donation.model'
import { Countries } from './models/permits/country.model'
import { Permit } from './models/permits/permit.model'
import { PermitHistoryEntry } from './models/permits/permitHistoryEntry.model'
import { PermitReturn } from './models/permits/permitReturn.model'
import { Permits } from './models/permits/permits.model'
import { MedicinePrescriptionDocumentsInput } from './models/prescriptionDocuments.dto'
import { PrescriptionDocuments } from './models/prescriptionDocuments.model'
import { Prescription, Prescriptions } from './models/prescriptions.model'
import { ReferralDetail } from './models/referral.model'
import { Referral, Referrals } from './models/referrals.model'
import { HealthDirectorateRenewalInput } from './models/renewal.input'
import { Vaccination, Vaccinations } from './models/vaccinations.model'
import { WaitlistDetail } from './models/waitlist.model'
import { Waitlist, Waitlists } from './models/waitlists.model'
import { HealthDirectorateHealthMessage } from './models/healthMessage.model'
import { HealthDirectorateHealthMessageAttachment } from './models/healthMessageAttachment.model'
import { HealthDirectorateHealthMessageDetail } from './models/healthMessageDetail.model'
import { HealthDirectorateHealthMessageEntry } from './models/healthMessageEntry.model'
import { HealthDirectorateHealthMessageType } from './models/healthMessageType.model'
import { HealthDirectorateHealthMessagingRecipient } from './models/healthMessagingRecipient.model'

@Injectable()
export class HealthDirectorateService {
  constructor(
    private readonly vaccinationApi: HealthDirectorateVaccinationsService,
    private readonly healthApi: HealthDirectorateHealthService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  /* Organ Donation */
  async getDonorStatus(auth: Auth, locale: Locale): Promise<Donor | null> {
    const data: OrganDonorDto | null = await this.healthApi.getOrganDonation(
      auth,
      locale,
    )
    if (data === null) {
      return null
    }
    const hasExceptionComment: boolean =
      data.exceptionComment !== undefined && data.exceptionComment.length > 0
    const hasExceptions: boolean =
      data.exceptions !== undefined && data.exceptions.length > 0
    const donorStatus: Donor = {
      isDonor: data.isDonor,
      limitations: {
        hasLimitations:
          ((hasExceptionComment || hasExceptions) && data.isDonor) ?? false,
        limitedOrgansList: data.exceptions,
        comment: data.exceptionComment,
      },
      isMinor: data.isMinor ?? false,
      isTemporaryResident: data.isTemporaryResident ?? false,
    }

    return donorStatus
  }

  async getDonationExceptions(
    auth: Auth,
    locale: Locale,
  ): Promise<Array<Organ>> {
    const data = await this.healthApi.getDonationExceptions(auth, locale)

    const limitations: Array<Organ> =
      data?.map((item) => {
        return {
          id: item.id,
          name: item.name,
        }
      }) ?? []

    return limitations
  }

  async updateDonorStatus(
    auth: Auth,
    input: DonorInput,
    locale: Locale,
  ): Promise<void> {
    const filteredList =
      input.organLimitations?.filter((item) => item !== 'other') ?? []

    return await this.healthApi.updateOrganDonation(
      auth,
      {
        isDonor: input.isDonor,
        exceptions: filteredList,
        exceptionComment: input.comment,
      },
      locale,
    )
  }

  /* Vaccinations */
  async getVaccinations(
    auth: Auth,
    locale: Locale,
  ): Promise<Vaccinations | null> {
    const data = await this.vaccinationApi.getVaccinationDiseaseDetail(
      auth,
      locale === 'is' ? 'is' : 'en',
    )
    if (!data) {
      return null
    }

    const vaccinations: Array<Vaccination> =
      data.map((item) => {
        return {
          id: item.diseaseId,
          name: item.diseaseName,
          description: item.diseaseDescription,
          isFeatured: item.isFeatured,
          status: mapVaccinationStatus(item.vaccinationStatus),
          statusName: item.vaccinationStatusName,
          statusColor: item.vaccinationStatusColor,
          lastVaccinationDate: item.lastVaccinationDate ?? null,
          comments: item.comments,
          vaccinationsInfo: item.vaccinations?.map(
            (vaccination: VaccinationDto) => {
              return {
                id: vaccination.id,
                name: vaccination.vaccineCodeDescriptionShort,
                date: vaccination.vaccinationDate,
                age: vaccination.vaccinationAge,
                url: vaccination.vaccineUrl,
                comment: vaccination.generalComment,
                rejected: vaccination.rejected,
                location: vaccination.vaccinationLocation,
              }
            },
          ),
        }
      }) ?? []

    return { vaccinations }
  }

  /* Waitlists */
  async getWaitlists(auth: Auth, locale: Locale): Promise<Waitlists | null> {
    const data = await this.healthApi.getWaitlists(auth, locale)

    if (!data) {
      return null
    }

    const waitlists: Array<Waitlist> =
      data.map((item) => {
        return {
          id: item.id,
          statusId: mapStatusIdToColor(item.statusId),
          lastUpdated: item.lastUpdated,
          name: item.name ?? '',
          waitBegan: item.waitBeganDate,
          organization: item.organizationName?.toString() ?? '',
          status: item.statusDisplay?.toString() ?? '',
        }
      }) ?? []

    return { waitlists }
  }

  /* Waitlist */
  async getWaitlist(
    auth: Auth,
    locale: Locale,
    id: string,
  ): Promise<WaitlistDetail | null> {
    const data = await this.getWaitlists(auth, locale)

    if (!data) {
      return null
    }

    const waitlist: Waitlist | undefined = data.waitlists.find(
      (item) => item.id === id,
    )

    return { data: waitlist }
  }

  /* Referrals */
  async getReferrals(auth: Auth, locale: Locale): Promise<Referrals | null> {
    const data = await this.healthApi.getReferrals(auth, locale)

    if (!data) {
      return null
    }

    const referrals: Array<Referral> =
      data.map((item) => {
        return {
          id: item.id,
          serviceName: item.serviceName,
          createdDate: item.createdDate,
          validUntilDate: item.validUntilDate,
          stateDisplay: item.statusDisplay,
          status: mapReferralStatusValueToStatus(item.statusValue),
          reason: item.reasonForReferral,
          diagnoses: item.diagnoses?.join(', '),
          fromContactInfo: item.fromContactInfo,
          toContactInfo: item.toContactInfo,
        }
      }) ?? []

    return { referrals }
  }

  /* Referral */
  async getReferral(
    auth: Auth,
    locale: Locale,
    id: string,
  ): Promise<ReferralDetail | null> {
    const data = await this.getReferrals(auth, locale)

    if (!data) {
      return null
    }

    const referral: Referral | undefined = data.referrals.find(
      (item) => item.id === id,
    )

    return { data: referral }
  }

  /* Prescriptions */
  async getPrescriptions(
    auth: Auth,
    locale: Locale,
  ): Promise<Prescriptions | null> {
    const data = await this.healthApi.getPrescriptions(auth, locale)

    if (!data) {
      return null
    }
    const prescriptions: Array<Prescription> =
      data.map((item) => {
        return {
          id: item.prescriptionId,
          productId: item.product.id,
          name: item.product.name,
          type: item.product.type,
          form: item.product.form,
          strength: item.product.strength,
          url: item.product.url,
          quantity: item.product?.quantity?.toString(),
          prescriberName: item.prescriber.name,
          medCardDrugId: item.medCard?.id,
          medCardDrugCategory: item.medCard?.category,
          issueDate: item.issueDate,
          expiryDate: item.expiryDate,
          dosageInstructions: item.dosageInstructions,
          indication: item.indication,
          totalPrescribedAmount: item.prescribedAmountDisplay,
          category: item.category
            ? mapPrescriptionCategory(item.category)
            : undefined,
          isRenewable: item.renewal.isRenewable,
          renewResponseMessage: item.renewal.responseMessage,
          renewalBlockedReason: item.renewal.blockedReason
            ? mapPrescriptionRenewalBlockedReason(item.renewal.blockedReason)
            : undefined,
          renewalStatus: item.renewal.status
            ? mapPrescriptionRenewalStatus(item.renewal.status)
            : undefined,
          amountRemaining: item.amountRemainingDisplay,
          dispensations: item.dispensations.flatMap((dispensation) => {
            return dispensation.dispensedItems.map((dispensedItem) => {
              return {
                id: dispensation.id,
                pharmacy: dispensation.dispensingAgentName,
                date: dispensation.dispensationDate,
                count: item.dispensations.length,
                itemId: dispensedItem.productId,
                name: dispensedItem.productName,
                strength: dispensedItem.productStrength,
                amount: dispensedItem.dispensedAmountDisplay,
              }
            })
          }),
        }
      }) ?? []

    return { prescriptions }
  }

  /* Renewal */
  async postRenewal(auth: Auth, input: HealthDirectorateRenewalInput) {
    await this.healthApi.postRenewalPrescription(auth, input.id)

    return null
  }

  /* Prescription Documents */
  async getPrescriptionDocuments(
    auth: Auth,
    input: MedicinePrescriptionDocumentsInput,
  ): Promise<PrescriptionDocuments | null> {
    const data = await this.healthApi.getPrescriptionDocuments(auth, input.id)

    if (!data) {
      return null
    }

    const documents = data.map((item) => {
      return {
        id: item.typeId.toString(),
        name: item.name,
        url: item.path,
      }
    })

    return { documents, id: input.id }
  }

  /* Medicine History */
  async getMedicineHistory(
    auth: Auth,
    locale: Locale,
  ): Promise<MedicineHistory | null> {
    const data = await this.healthApi.getGroupedDispensations(auth, locale)
    if (!data) {
      return null
    }

    const medicineHistory: Array<MedicineHistoryItem> =
      data.map((item) => {
        return {
          id: item.product.id,
          name: item.product.name,
          strength: item.product.strength,
          atcCode: item.product.atcCode,
          indication: item.indication,
          lastDispensationDate: item.lastDispensationDate,
          dispensationCount: item.dispensationCount,
          dispensations: item.dispensations.map(mapDispensationItem),
        }
      }) ?? []

    return { medicineHistory }
  }

  /* Medicine dispensations for specific ATC code */
  async getMedicineDispensationsForATC(
    auth: Auth,
    locale: Locale,
    input: MedicineDispensationsATCInput,
  ): Promise<MedicineDispensationsATC | null> {
    const data = await this.healthApi.getDispensations(
      auth,
      input.atcCode,
      locale,
    )
    if (!data) {
      return null
    }

    const dispensations: Array<MedicineHistoryDispensation> =
      data.map(mapDispensationItem)

    return { dispensations }
  }
  /* Medicine Delegations */
  async getMedicineDelegations(
    auth: Auth,
    locale: Locale,
    input: MedicineDelegationInput,
  ): Promise<MedicineDelegations | null> {
    const medicineDelegations = await this.healthApi.getMedicineDelegations(
      auth,
      locale,
      input.status
        .filter((status) => status !== PermitStatusEnum.unknown)
        .map((status) =>
          status === PermitStatusEnum.awaitingApproval ? 'pending' : status,
        ),
    )

    if (!medicineDelegations) {
      return null
    }

    const data: MedicineDelegations = {
      items: medicineDelegations.map((item) => ({
        cacheId: [
          item.toNationalId,
          item.validFrom?.toISOString() || 'no-start',
          item.validTo?.toISOString() || 'no-end',
          item.status,
          locale,
        ].join('-'),
        name: item.toName,
        nationalId: item.toNationalId,
        dates: {
          from: item.validFrom,
          to: item.validTo,
        },
        isActive: item.status === 'active',
        status: mapDelegationStatus(item.status),
        lookup: item.commissionType === 1,
      })),
    }
    return { items: sortBy(data.items, 'status') }
  }

  async postMedicineDelegation(
    auth: Auth,
    input: MedicineDelegationCreateOrDeleteInput,
  ): Promise<HealthDirectorateResponse> {
    return await this.healthApi
      .putMedicineDelegation(auth, {
        commissionType: input.lookup ? 1 : 0,
        toNationalId: input.nationalId,
        validFrom: input.from?.toISOString(),
        validTo: input.to?.toISOString(),
        isActive: true,
      })
      .then(() => {
        return { success: true }
      })
      .catch(() => {
        return {
          success: false,
          message: 'Failed to create medicine delegation',
        }
      })
  }

  async deleteMedicineDelegation(
    auth: Auth,
    input: MedicineDelegationCreateOrDeleteInput,
  ): Promise<HealthDirectorateResponse> {
    return await this.healthApi
      .putMedicineDelegation(auth, {
        isActive: false,
        toNationalId: input.nationalId,
        commissionType: input.lookup ? 1 : 0,
      })
      .then(() => {
        return { success: true }
      })
      .catch(() => {
        return {
          success: false,
          message: 'Failed to deactivate medicine delegation',
        }
      })
  }

  /* Patient data - Permits */
  async getPermits(auth: Auth, locale: Locale): Promise<Permits | null> {
    const response = await this.healthApi.getPermits(auth, locale)

    if (!response) {
      return null
    }

    const consent: Permit | null = response.consent
      ? mapPermit(response.consent, locale)
      : null

    const history: PermitHistoryEntry[] = (response.history ?? []).map(
      mapPermitHistoryEntry,
    )

    return { consent, history }
  }

  /* Patient data - Permit countries */
  async getPermitCountries(
    auth: Auth,
    locale: Locale,
  ): Promise<Countries | null> {
    const countries = await this.healthApi.getPermitCountries(auth, locale)

    if (!countries) {
      return null
    }

    return {
      data: countries,
    }
  }

  /* Patient data - Create approval */
  async createPermit(
    auth: Auth,
    input: PermitInput,
  ): Promise<PermitReturn | null> {
    const mappedInput: CreateEuPatientConsentDto = {
      codes: [PATIENT_PERMIT_CODE], // Fixed code for patient summary consent
      countryCodes: input.countryCodes,
      validFrom: new Date(input.validFrom),
      validTo: new Date(input.validTo),
    }
    const response = await this.healthApi.createPermit(auth, mappedInput)
    return response ? { status: true } : null
  }

  /* Patient data - invalidate permit */
  async invalidatePermit(auth: Auth): Promise<PermitReturn | null> {
    const data = await this.healthApi.deactivatePermit(auth)
    return data != null ? { status: true } : null
  }

  /* Appointments */
  public async getAppointments(
    auth: Auth,
    input: HealthDirectorateAppointmentsInput,
  ): Promise<Appointments | null> {
    const data = await this.healthApi.getAppointments(
      auth,
      input.from,
      input.status
        ?.map((status) => mapAppointmentStatus(status))
        .filter(isDefined),
    )
    if (!data) {
      return null
    }

    // Sort data by startTime before mapping
    const sortedData = [...data].sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    })

    const appointments: Array<Appointment> = sortedData.map((item) => ({
      id: item.id,
      date: item.startTime,
      title: item.description,
      status: toAppointmentStatusEnum(item.status),
      duration: item.duration,
      location: item.location
        ? {
            name: item.location.name,
            organization: item.location.organization,
            address: item.location.address,
            city: item.location.city,
            latitude: item.location.latitude,
            longitude: item.location.longitude,
          }
        : undefined,
      instruction: item.patientInstruction,
      practitioners: item.practitioners ?? [],
    }))
    return { data: appointments }
  }

  public async getAppointmentById(
    auth: Auth,
    input: HealthDirectorateAppointmentInput,
  ): Promise<AppointmentDetail | null> {
    const { id } = input
    const item = await this.healthApi.getAppointmentById(auth, id)
    if (!item) {
      return null
    }

    return {
      id: item.id,
      date: item.startTime,
      title: item.description,
      status: toAppointmentStatusEnum(item.status),
      instruction: item.patientInstruction,
      duration: item.duration,
      location: item.location
        ? {
            name: item.location.name,
            organization: item.location.organization,
            address: item.location.address,
            directions: item.location.directions,
            link: item.location.link,
            city: item.location.city,
            postalCode: item.location.postalCode,
            country: item.location.country,
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            phoneNumber: item.location.phoneNumber,
            openingHoursText: item.location.openingHours?.text,
          }
        : undefined,
      practitioners: item.practitioners ?? [],
    }
  }

  /* Health Messages */

  private mapMessageAttachment(
    a: ConversationAttachmentDto,
    conversationId: string,
    messageId: string,
  ): HealthDirectorateHealthMessageAttachment {
    return {
      id: a.id,
      fileName: a.fileName,
      description: a.description,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/health/messages/${conversationId}/${messageId}/${a.id}`,
    }
  }

  private mapMessageEntry(
    m: ConversationMessageDto,
    conversationId: string,
  ): HealthDirectorateHealthMessageEntry {
    return {
      id: m.id,
      direction:
        m.direction as HealthDirectorateHealthMessageEntry['direction'],
      messageSentAt: m.messageSentAt,
      messageTextContent: m.messageTextContent,
      senderGroupName: m.senderGroupName,
      attachments: m.attachments.map((a) =>
        this.mapMessageAttachment(a, conversationId, m.id),
      ),
    }
  }

  async getHealthMessages(
    auth: Auth,
    status?: ConversationStatusFilter,
    starred?: boolean,
  ): Promise<HealthDirectorateHealthMessage[] | null> {
    const items = await this.healthApi.getConversations(auth, status, starred)
    if (!items) return null

    return items.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      messageCount: c.messageCount,
      lastMessageSentAt: c.lastMessageSentAt,
      lastSenderGroupName: c.lastSenderGroupName,
      hasAttachment: c.hasAttachment,
      isStarred: c.isStarred,
      isArchived: c.isArchived,
      isRead: !c.unread,
    }))
  }

  async getHealthMessage(
    auth: Auth,
    id: string,
  ): Promise<HealthDirectorateHealthMessageDetail | null> {
    const c = await this.healthApi.getConversation(auth, id)
    if (!c) return null

    return {
      id: c.id,
      title: c.title,
      status: c.status,
      startDate: c.conversationStartDate,
      messageCount: c.messageCount,
      lastMessageSentAt: c.lastMessageSentAt,
      lastSenderGroupName: c.lastSenderGroupName,
      hasAttachment: c.hasAttachment,
      isStarred: c.isStarred,
      isArchived: c.isArchived,
      patientCanReply: c.patientCanReply,
      isRead: !c.unread,
      messages: c.messages.map((m) => this.mapMessageEntry(m, c.id)),
    }
  }

  async createHealthMessage(
    auth: Auth,
    input: HealthDirectorateCreateMessageInput,
  ): Promise<HealthDirectorateHealthMessageDetail | null> {
    const body: CreateConversationRequestDto = {
      nodeId: input.nodeId,
      groupId: input.groupId,
      patientInitiatedTypeCode: input.patientInitiatedTypeCode,
      title: input.title ?? '',
      messageTextContent: input.messageTextContent,
      attachments: input.attachments?.map((a) => ({
        fileName: a.fileName,
        description: a.description,
        contentType: a.contentType as ConversationAttachmentRequestDto['contentType'],
        contentBase64: a.contentBase64,
      })),
    }

    const c = await this.healthApi.createConversation(auth, body)
    if (!c) return null

    return {
      id: c.id,
      title: c.title,
      status: c.status,
      startDate: c.conversationStartDate,
      messageCount: c.messageCount,
      lastMessageSentAt: c.lastMessageSentAt,
      lastSenderGroupName: c.lastSenderGroupName,
      hasAttachment: c.hasAttachment,
      isStarred: c.isStarred,
      isArchived: c.isArchived,
      patientCanReply: c.patientCanReply,
      isRead: !c.unread,
      messages: c.messages.map((m) => this.mapMessageEntry(m, c.id)),
    }
  }

  async replyToHealthMessage(
    auth: Auth,
    id: string,
    input: HealthDirectorateReplyToMessageInput,
  ): Promise<HealthDirectorateHealthMessageDetail | null> {
    const body: CreateReplyRequestDto = {
      messageTextContent: input.messageTextContent,
      attachments: input.attachments?.map((a) => ({
        fileName: a.fileName,
        description: a.description,
        contentType: a.contentType as ConversationAttachmentRequestDto['contentType'],
        contentBase64: a.contentBase64,
      })),
    }

    const c = await this.healthApi.replyToConversation(auth, id, body)
    if (!c) return null

    return {
      id: c.id,
      title: c.title,
      status: c.status,
      startDate: c.conversationStartDate,
      messageCount: c.messageCount,
      lastMessageSentAt: c.lastMessageSentAt,
      lastSenderGroupName: c.lastSenderGroupName,
      hasAttachment: c.hasAttachment,
      isStarred: c.isStarred,
      isArchived: c.isArchived,
      patientCanReply: c.patientCanReply,
      isRead: !c.unread,
      messages: c.messages.map((m) => this.mapMessageEntry(m, c.id)),
    }
  }

  async markHealthMessageAsRead(auth: Auth, id: string): Promise<boolean> {
    await this.healthApi.markConversationAsRead(auth, id)
    return true
  }

  async archiveHealthMessage(auth: Auth, id: string): Promise<boolean> {
    await this.healthApi.archiveConversation(auth, id)
    return true
  }

  async unarchiveHealthMessage(auth: Auth, id: string): Promise<boolean> {
    await this.healthApi.unarchiveConversation(auth, id)
    return true
  }

  async starHealthMessage(auth: Auth, id: string): Promise<boolean> {
    await this.healthApi.starConversation(auth, id)
    return true
  }

  async unstarHealthMessage(auth: Auth, id: string): Promise<boolean> {
    await this.healthApi.unstarConversation(auth, id)
    return true
  }

  async getHealthMessagingRecipients(
    auth: Auth,
    locale: Locale = 'is',
  ): Promise<HealthDirectorateHealthMessagingRecipient[] | null> {
    const items = await this.healthApi.getMessagingRecipients(auth, locale)
    if (!items) return null

    return items.map(
      (r): HealthDirectorateHealthMessagingRecipient => ({
        nodeId: r.nodeId,
        groupId: r.groupId,
        name: r.name,
        allowsMessaging: r.allowsMessaging,
        messagingWindowOpen: r.messagingWindowOpen,
        messagingWindowClose: r.messagingWindowClose,
        isCurrentlyWithinWindow: r.isCurrentlyWithinWindow,
        patientReplyWindowDays: r.patientReplyWindowDays,
        allowedMessageTypes: r.allowedConversationTypes.map(
          (t): HealthDirectorateHealthMessageType => ({
            patientInitiatedTypeCode: t.patientInitiatedTypeCode,
            title: t.title,
            description: t.description,
            isCertificate: t.isCertificate,
          }),
        ),
      }),
    )
  }
}
