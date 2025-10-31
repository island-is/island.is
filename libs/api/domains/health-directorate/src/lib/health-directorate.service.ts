import { Auth } from '@island.is/auth-nest-tools'
import {
  HealthDirectorateVaccinationsService,
  OrganDonorDto,
  PrescriptionRenewalRequestDto,
  VaccinationDto,
  organLocale,
  HealthDirectorateHealthService,
  HealthDirectorateOrganDonationService,
} from '@island.is/clients/health-directorate'
import type { Locale } from '@island.is/shared/types'
import { Inject, Injectable } from '@nestjs/common'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import isNumber from 'lodash/isNumber'
import sortBy from 'lodash/sortBy'
import { Donor, DonorInput, Organ } from './models/organ-donation.model'
import {
  MedicineDelegationCreateInput,
  MedicineDelegationDeleteInput,
} from './dto/medicineDelegation.input'
import { HealthDirectorateResponse } from './dto/response.dto'
import { MedicineDelegations } from './models/medicineDelegation.model'
import {
  MedicineHistory,
  MedicineHistoryDispensation,
  MedicineHistoryItem,
} from './models/medicineHistory.model'
import { MedicineDispensationsATCInput } from './models/medicineHistoryATC.dto'
import { MedicineDispensationsATC } from './models/medicineHistoryATC.model'
import { MedicinePrescriptionDocumentsInput } from './models/prescriptionDocuments.dto'
import { PrescriptionDocuments } from './models/prescriptionDocuments.model'
import { Prescription, Prescriptions } from './models/prescriptions.model'
import { ReferralDetail } from './models/referral.model'
import { Referral, Referrals } from './models/referrals.model'
import { HealthDirectorateRenewalInput } from './models/renewal.input'
import { Vaccination, Vaccinations } from './models/vaccinations.model'
import { WaitlistDetail } from './models/waitlist.model'
import { Waitlist, Waitlists } from './models/waitlists.model'
import {
  InvalidatePermitInput,
  PermitInput,
  PermitsInput,
} from './dto/permit.input'
import { Countries } from './models/permits/country.model'
import { Permit, PermitReturn, Permits } from './models/permits/permits'
import {
  mapDispensationItem,
  mapPermit,
  mapPrescriptionCategory,
  mapPrescriptionRenewalBlockedReason,
  mapPrescriptionRenewalStatus,
  mapVaccinationStatus,
} from './utils/mappers'
import { PermitStatusEnum } from './models/enums'

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
          reason: item.reasonForReferral,
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
          id: item.productId,
          name: item.productName,
          type: item.productType,
          form: item.productForm,
          url: item.productUrl,
          quantity: item.productQuantity?.toString(),
          prescriberName: item.prescriberName,
          medCardDrugId: item.medCardDrugId,
          issueDate: item.issueDate,
          expiryDate: item.expiryDate,
          dosageInstructions: item.dosageInstructions,
          indication: item.indication,
          totalPrescribedAmount: item.prescribedAmountDisplay,
          category: item.category
            ? mapPrescriptionCategory(item.category)
            : undefined,
          isRenewable: item.isRenewable,
          renewalBlockedReason: item.renewalBlockedReason
            ? mapPrescriptionRenewalBlockedReason(item.renewalBlockedReason)
            : undefined,
          renewalStatus: item.renewalStatus
            ? mapPrescriptionRenewalStatus(item.renewalStatus)
            : undefined,
          amountRemaining: item.amountRemainingDisplay,
          dispensations: item.dispensations.map((item) => {
            return {
              id: item.id,
              agentName: item.dispensingAgentName,
              date: item.dispensationDate,
              count: item.dispensedItems.length,
              items: item.dispensedItems.map((item) => {
                return {
                  id: item.productId,
                  name: item.productName,
                  strength: item.productStrength,
                  amount: item.dispensedAmountDisplay,
                }
              }),
            }
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
          id: item.productId,
          name: item.productName,
          strength: item.productStrength,
          atcCode: item.productAtcCode,
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
    active: boolean,
  ): Promise<MedicineDelegations | null> {
    const medicineDelegations = await this.healthApi.getMedicineDelegations(
      auth,
      locale,
      active,
    )

    if (!medicineDelegations) {
      return null
    }

    const data: MedicineDelegations = {
      items: medicineDelegations.map((item) => ({
        cacheId: [item.toName, item.toNationalId, locale].join('-'),
        name: item.toName,
        nationalId: item.toNationalId,
        dates: {
          from: item.validFrom,
          to: item.validTo,
        },
        isActive: item.isActive,
        lookup: item.commissionType === 1,
      })),
    }

    return data
  }

  async postMedicineDelegation(
    auth: Auth,
    input: MedicineDelegationCreateInput,
  ): Promise<HealthDirectorateResponse> {
    return await this.healthApi
      .postMedicineDelegation(auth, {
        commissionType: input.lookup ? 1 : 0,
        toNationalId: input.nationalId,
        validFrom: input.from?.toISOString(),
        validTo: input.to?.toISOString(),
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
    input: MedicineDelegationDeleteInput,
  ): Promise<HealthDirectorateResponse> {
    return await this.healthApi
      .deleteMedicineDelegation(auth, input.nationalId)
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
      input.statuses.map((status) =>
        status === PermitStatusEnum.awaitingApproval ? 'pending' : status,
      ),
    )

    if (!permits) {
      return null
    }

    const data: Permit[] = permits.map((item) => mapPermit(item, locale)) ?? []
    const sorted = sortBy(data, 'status', 'asc')
    return { data: sorted }
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
    const response = await this.healthApi.createPermit(auth, {
      codes: input.codes,
      countryCodes: input.countryCodes,
      validFrom: new Date(input.validFrom),
      validTo: new Date(input.validTo),
    })
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
}
