import { Auth } from '@island.is/auth-nest-tools'
import {
  CreateEuPatientConsentDto,
  HealthDirectorateHealthService,
  HealthDirectorateOrganDonationService,
  HealthDirectorateVaccinationsService,
  OrganDonorDto,
  PrescriptionRenewalRequestDto,
  UserVisibleAppointmentStatuses,
  VaccinationDto,
  organLocale,
} from '@island.is/clients/health-directorate'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { Locale } from '@island.is/shared/types'
import { Inject, Injectable } from '@nestjs/common'
import isNumber from 'lodash/isNumber'
import sortBy from 'lodash/sortBy'
import { PATIENT_PERMIT_CODE } from './constants'
import { HealthDirectorateAppointmentsInput } from './dto/appointments.input'
import {
  MedicineDelegationCreateOrDeleteInput,
  MedicineDelegationInput,
} from './dto/medicineDelegation.input'
import {
  InvalidatePermitInput,
  PermitInput,
  PermitsInput,
} from './dto/permit.input'
import { HealthDirectorateResponse } from './dto/response.dto'
import {
  mapAppointmentStatus,
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
import { mapCountryPermitStatus, mapPermit } from './mappers/patientDataMapper'
import { Appointment, Appointments } from './models/appointments.model'
import {
  PregnancyMeasurement,
  PregnancyMeasurements,
} from './models/pregnancy-measurements.model'
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
import { Permit, PermitReturn, Permits } from './models/permits/permits'
import { MedicinePrescriptionDocumentsInput } from './models/prescriptionDocuments.dto'
import { PrescriptionDocuments } from './models/prescriptionDocuments.model'
import { Prescription, Prescriptions } from './models/prescriptions.model'
import { ReferralDetail } from './models/referral.model'
import { Referral, Referrals } from './models/referrals.model'
import { HealthDirectorateRenewalInput } from './models/renewal.input'
import { Vaccination, Vaccinations } from './models/vaccinations.model'
import { WaitlistDetail } from './models/waitlist.model'
import { Waitlist, Waitlists } from './models/waitlists.model'

@Injectable()
export class HealthDirectorateService {
  constructor(
    private readonly vaccinationApi: HealthDirectorateVaccinationsService,
    private readonly healthApi: HealthDirectorateHealthService,
    private readonly organDonationApi: HealthDirectorateOrganDonationService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  /* Organ Donation */
  async getDonorStatus(auth: Auth, locale: Locale): Promise<Donor | null> {
    const lang: organLocale = locale === 'is' ? organLocale.Is : organLocale.En
    const data: OrganDonorDto | null =
      await this.organDonationApi.getOrganDonation(auth, lang)
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
    const lang: organLocale = locale === 'is' ? organLocale.Is : organLocale.En
    const data = await this.organDonationApi.getDonationExceptions(auth, lang)

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

    return await this.organDonationApi.updateOrganDonation(
      auth,
      {
        isDonor: input.isDonor,
        exceptions: filteredList,
        exceptionComment: input.comment,
      },
      locale === 'is' ? organLocale.Is : organLocale.En,
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
          id: item.product.id,
          name: item.product.name,
          type: item.product.type,
          form: item.product.form,
          strength: item.product.strength,
          url: item.product.url,
          quantity: item.product?.quantity?.toString(),
          prescriberName: item.prescriber.name,
          medCardDrugId: item.medCard?.id,
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
    const parsedInput = this.castRenewalInputToNumber(input)

    if (!parsedInput) return null

    // TODO: FIX WHEN RESPONSE BODY IS READY FROM CLIENT
    await this.healthApi
      .postRenewalPrescription(auth, input.id, {
        medCardDrugId: input.medCardDrugId ?? input.id,
        medCardDrugCategory: parsedInput.medCardDrugCategory,
        prescribedItemId: parsedInput.prescribedItemId,
      })
      .catch((e) => {
        return e
      })
      .then(() => {
        return
      })

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
      input.status.map((status) =>
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
  async getPermits(
    auth: Auth,
    locale: Locale,
    input: PermitsInput,
  ): Promise<Permits | null> {
    const permits = await this.healthApi.getPermits(
      auth,
      locale,
      input.status.map((status) => mapCountryPermitStatus(status)),
    )

    if (!permits) {
      return null
    }

    const data: Permit[] = permits.map((item) => mapPermit(item, locale)) ?? []
    return { data: sortBy(data, 'status') }
  }

  /* Patient data - Permit Detail */
  async getPermit(
    auth: Auth,
    locale: Locale,
    id: string,
  ): Promise<Permit | null> {
    const permit = await this.healthApi.getPermit(auth, locale, id)

    if (!permit) {
      return null
    }

    return mapPermit(permit, locale)
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
  async invalidatePermit(
    auth: Auth,
    input: InvalidatePermitInput,
  ): Promise<PermitReturn | null> {
    const data = await this.healthApi.deactivatePermit(auth, input.id)
    return data ? { status: true } : null
  }

  private castRenewalInputToNumber = (
    input: HealthDirectorateRenewalInput,
  ): PrescriptionRenewalRequestDto | null => {
    // Trim whitespace from the string
    const trimmedCategory = input.medCardDrugCategory.trim()
    const trimmedId = input.prescribedItemId.trim()

    // Try to convert the string to a number
    const parsedCategory = Number(trimmedCategory)
    const parsedId = Number(trimmedId)

    if (isNumber(parsedCategory) && isNumber(parsedId)) {
      return {
        prescribedItemId: parsedId,
        medCardDrugCategory: parsedCategory,
        medCardDrugId: input.medCardDrugId,
      }
    } else return null
  }

  /* Appointments */
  public async getAppointments(
    auth: Auth,
    input: HealthDirectorateAppointmentsInput,
  ): Promise<Appointments | null> {
    try {
      const data = await this.healthApi.getAppointments(
        auth,
        input.from,
        input.status
          ?.map((status) => mapAppointmentStatus(status))
          .filter(
            (status): status is UserVisibleAppointmentStatuses =>
              status !== null,
          ),
      )
      if (!data) {
        return null
      }

      // Sort data by startTime before mapping
      const sortedData = [...data].sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      })

      const appointments: Array<Appointment> =
        sortedData.map((item) => {
          const data: Appointment = {
            id: item.id,
            date: item.startTime?.toISOString(),
            title: item.description,
            status: item.status,
            instruction: item.patientInstruction,
            duration: item.duration,
            location: item.location
              ? {
                  name: item.location.name,
                  organization: item.location.organization || '',
                  address: item.location.address,
                  directions: item.location.directions || '',
                  city: item.location.city || '',
                  postalCode: item.location.postalCode || '',
                  country: item.location.country || '',
                  latitude: item.location.latitude || undefined,
                  longitude: item.location.longitude || undefined,
                }
              : undefined,
            practitioners: item.practitioners || [],
          }
          return data
        }) ?? []
      return { data: appointments }
    } catch (error) {
      this.logger.warn(
        'Error fetching appointments from Health Directorate API',
        error,
      )
      return null
    }
  }

  /**
   * Pregnancy measurements for the current user.
   * TODO: Connect to health directorate service endpoint when ready.
   */
  public async getPregnancyMeasurements(
    _auth: Auth,
  ): Promise<PregnancyMeasurements> {
    // Mock data until service endpoint is available
    const data: PregnancyMeasurement[] = [
      {
        date: '18.02.2025',
        weightKg: 77,
        fundalHeightCm: 20,
        bloodPressure: '114/73',
        pulsePerMin: 103,
        proteinInUrine: 'negative',
      },
      {
        date: '12.02.2025',
        weightKg: null,
        fundalHeightCm: null,
        bloodPressure: null,
        pulsePerMin: null,
        proteinInUrine: null,
      },
      {
        date: '11.02.2025',
        weightKg: 77,
        fundalHeightCm: null,
        bloodPressure: null,
        pulsePerMin: null,
        proteinInUrine: 'negative',
      },
      {
        date: '07.01.2025',
        weightKg: 75,
        fundalHeightCm: null,
        bloodPressure: '111/77',
        pulsePerMin: 77,
        proteinInUrine: 'negative',
      },
    ]
    return { data }
  }
}
